import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import {
  type AiConnector,
  type AiConnectorConfig,
  type AiProvider,
  AiProviderError,
  type AiRequest,
  type AiResponse,
  type AiStreamChunk,
} from '../types.js';

/**
 * Claude Code as a plain writing engine, on the person's own Claude plan.
 *
 * Arpli runs the person's own, unmodified `claude` program in print mode with
 * everything that could act on their computer switched off: no tools, no MCP
 * servers, none of their user or project settings (so none of their hooks or
 * plugins), no skills, no saved session, and it runs inside an empty
 * temporary folder that is removed afterwards. Arpli never reads Claude's
 * stored credentials: the program signs itself in.
 *
 * Policy (design/01-preplanning.md section 9): Anthropic does not prevent an
 * end user from running the unmodified Claude Code binary with their own
 * subscription, but it does not permit third parties to route requests
 * through plan credentials. Keep this provider opt-in, and confirm with
 * Anthropic before offering it widely.
 *
 * `config.baseUrl` is reused as an optional path to the `claude` binary.
 */

export const CLAUDE_CODE_PROVIDER: AiProvider = 'claude-code';

const DEFAULT_TIMEOUT_MS = 180_000;
const DEFAULT_SYSTEM =
  'You are a careful writing assistant. Reply with the requested text only, with no preamble.';

/** Where Claude Code's installers put the program, for apps that don't inherit the shell's PATH. */
const KNOWN_PATHS = [
  '/opt/homebrew/bin/claude',
  '/usr/local/bin/claude',
  join(homedir(), '.local', 'bin', 'claude'),
  join(homedir(), '.claude', 'local', 'claude'),
];

export interface RunResult {
  code: number | null;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

export type CliRunner = (
  bin: string,
  args: string[],
  opts: { stdin: string; cwd: string; env: NodeJS.ProcessEnv; timeoutMs: number },
) => Promise<RunResult>;

/** Runs a program, feeding `stdin`, and collects its output. Never uses a shell. */
export const defaultRunner: CliRunner = (bin, args, opts) =>
  new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd: opts.cwd, env: opts.env, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
    }, opts.timeoutMs);
    child.stdout.on('data', (chunk: Buffer) => (stdout += chunk.toString('utf8')));
    child.stderr.on('data', (chunk: Buffer) => (stderr += chunk.toString('utf8')));
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut });
    });
    child.stdin.end(opts.stdin, 'utf8');
  });

/** Finds the `claude` program: an explicit path, then PATH, then the known install folders. */
export function findClaudeBinary(
  override?: string | null,
  envPath: string = process.env.PATH ?? '',
  exists: (path: string) => boolean = existsSync,
): string | null {
  if (override && exists(override)) return override;
  for (const dir of envPath.split(delimiter)) {
    if (!dir) continue;
    const candidate = join(dir, 'claude');
    if (exists(candidate)) return candidate;
  }
  for (const candidate of KNOWN_PATHS) {
    if (exists(candidate)) return candidate;
  }
  return null;
}

/** The environment for the child: an Anthropic key set on the computer would bill the API instead of the plan. */
export function cleanEnv(env: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  const next: NodeJS.ProcessEnv = { ...env };
  delete next.ANTHROPIC_API_KEY;
  delete next.ANTHROPIC_AUTH_TOKEN;
  return next;
}

/** Print mode takes one prompt, so the conversation is flattened and system text goes to `--system-prompt`. */
export function buildPrompt(req: AiRequest): { system: string; prompt: string } {
  const system = [req.systemPrompt, ...req.messages.filter((m) => m.role === 'system').map((m) => m.content)]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join('\n\n');
  const turns = req.messages.filter((m) => m.role !== 'system');
  const prompt =
    turns.length === 1
      ? turns[0].content
      : turns.map((m) => `${m.role === 'assistant' ? 'Assistant' : 'User'}:\n${m.content}`).join('\n\n');
  return { system: system || DEFAULT_SYSTEM, prompt };
}

/**
 * Flags for a plain, single text generation. Deliberately not `--bare`:
 * bare mode never reads the person's sign-in, so it can't use their plan.
 */
export function buildArgs(system: string, model?: string | null): string[] {
  const args = [
    '-p',
    '--output-format',
    'json',
    '--tools',
    '',
    '--strict-mcp-config',
    '--setting-sources',
    'project',
    '--disable-slash-commands',
    '--no-session-persistence',
    '--system-prompt',
    system,
  ];
  if (model && model !== 'default') args.push('--model', model);
  return args;
}

interface ClaudeResult {
  type?: string;
  subtype?: string;
  is_error?: boolean;
  result?: string;
  usage?: { input_tokens?: number; output_tokens?: number };
  modelUsage?: Record<string, { outputTokens?: number }>;
}

/** Reads print mode's JSON result. The model is the one that wrote the most output. */
export function parseResult(stdout: string): {
  ok: boolean;
  text: string;
  model: string | null;
  usage?: AiResponse['usage'];
} {
  let data: ClaudeResult;
  try {
    data = JSON.parse(stdout.trim()) as ClaudeResult;
  } catch {
    return { ok: false, text: stdout.trim(), model: null };
  }
  const models = Object.entries(data.modelUsage ?? {}).sort(
    (a, b) => (b[1].outputTokens ?? 0) - (a[1].outputTokens ?? 0),
  );
  const input = data.usage?.input_tokens;
  const output = data.usage?.output_tokens;
  return {
    ok: data.subtype === 'success' && data.is_error !== true,
    text: (data.result ?? '').trim(),
    model: models[0]?.[0] ?? null,
    usage:
      input === undefined && output === undefined
        ? undefined
        : {
            promptTokens: input,
            completionTokens: output,
            totalTokens: (input ?? 0) + (output ?? 0),
          },
  };
}

/** Whether Claude Code is installed and signed in, and on which plan. Never returns the account's email. */
export async function claudeCodeStatus(
  runner: CliRunner = defaultRunner,
  bin: string | null = findClaudeBinary(),
): Promise<{ found: boolean; loggedIn: boolean; plan: string | null; path: string | null }> {
  if (!bin) return { found: false, loggedIn: false, plan: null, path: null };
  try {
    const res = await runner(bin, ['auth', 'status'], {
      stdin: '',
      cwd: tmpdir(),
      env: cleanEnv(process.env),
      timeoutMs: 15_000,
    });
    const data = JSON.parse(res.stdout.trim()) as { loggedIn?: boolean; subscriptionType?: string };
    return {
      found: true,
      loggedIn: data.loggedIn === true,
      plan: typeof data.subscriptionType === 'string' ? data.subscriptionType : null,
      path: bin,
    };
  } catch {
    return { found: true, loggedIn: false, plan: null, path: bin };
  }
}

export class ClaudeCodeConnector implements AiConnector {
  public readonly provider: AiProvider = CLAUDE_CODE_PROVIDER;
  public readonly model: string;
  private readonly binOverride: string | null;

  constructor(
    config: AiConnectorConfig,
    private readonly runner: CliRunner = defaultRunner,
    private readonly timeoutMs: number = DEFAULT_TIMEOUT_MS,
  ) {
    this.model = config.model || 'default';
    this.binOverride = config.baseUrl ?? null;
  }

  async complete(req: AiRequest): Promise<AiResponse> {
    const bin = findClaudeBinary(this.binOverride);
    if (!bin) {
      throw new AiProviderError(this.provider, 'Claude Code is not installed on this Mac');
    }
    const { system, prompt } = buildPrompt(req);
    const cwd = await mkdtemp(join(tmpdir(), 'arpli-claude-'));
    try {
      let res: RunResult;
      try {
        res = await this.runner(bin, buildArgs(system, req.model ?? this.model), {
          stdin: prompt,
          cwd,
          env: cleanEnv(process.env),
          timeoutMs: this.timeoutMs,
        });
      } catch (err) {
        throw new AiProviderError(this.provider, `could not start Claude Code: ${(err as Error).message}`, err);
      }
      if (res.timedOut) {
        throw new AiProviderError(this.provider, `Claude Code took longer than ${Math.round(this.timeoutMs / 1000)} seconds`);
      }
      const parsed = parseResult(res.stdout);
      if (!parsed.ok || res.code !== 0) {
        const detail = parsed.text || res.stderr.trim() || `exit code ${res.code}`;
        throw new AiProviderError(this.provider, detail);
      }
      return {
        provider: this.provider,
        model: parsed.model ?? this.model,
        content: parsed.text,
        usage: parsed.usage,
      };
    } finally {
      await rm(cwd, { recursive: true, force: true });
    }
  }

  /** Print mode's JSON is one result, so this yields the whole answer as one chunk for now. */
  async *stream(req: AiRequest): AsyncIterable<AiStreamChunk> {
    const response = await this.complete(req);
    yield { provider: this.provider, model: response.model, delta: response.content, done: true };
  }

  async testConnection(): Promise<boolean> {
    const status = await claudeCodeStatus(this.runner, findClaudeBinary(this.binOverride));
    return status.loggedIn;
  }
}
