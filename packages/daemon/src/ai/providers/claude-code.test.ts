import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  ClaudeCodeConnector,
  buildArgs,
  buildPrompt,
  claudeCodeStatus,
  cleanEnv,
  findClaudeBinary,
  parseResult,
  type CliRunner,
} from './claude-code.js';
import { AiProviderError } from '../types.js';
import { loadConnector } from '../manager.js';

const SUCCESS = JSON.stringify({
  type: 'result',
  subtype: 'success',
  is_error: false,
  result: '  A true, short answer.  ',
  usage: { input_tokens: 120, output_tokens: 9 },
  modelUsage: {
    'claude-haiku-4-5': { outputTokens: 3 },
    'claude-opus-4-7': { outputTokens: 9 },
  },
});

/** A fake `claude` binary on disk, so findClaudeBinary() resolves in tests. */
function withFakeBinary<T>(fn: (bin: string) => Promise<T>): Promise<T> {
  const dir = mkdtempSync(join(tmpdir(), 'arpli-test-bin-'));
  const bin = join(dir, 'claude');
  writeFileSync(bin, '');
  return fn(bin).finally(() => rmSync(dir, { recursive: true, force: true }));
}

test('buildArgs switches off tools, MCP, user settings, skills and sessions, and never uses bare mode', () => {
  const args = buildArgs('system text', 'default');
  assert.deepEqual(args.slice(0, 3), ['-p', '--output-format', 'json']);
  assert.equal(args[args.indexOf('--tools') + 1], '', 'tools must be an empty list');
  assert.ok(args.includes('--strict-mcp-config'));
  assert.equal(args[args.indexOf('--setting-sources') + 1], 'project');
  assert.ok(args.includes('--disable-slash-commands'));
  assert.ok(args.includes('--no-session-persistence'));
  assert.equal(args[args.indexOf('--system-prompt') + 1], 'system text');
  assert.ok(!args.includes('--bare'), 'bare mode cannot use the plan sign-in');
  assert.ok(!args.includes('--model'), '"default" leaves the model to the plan');
  assert.deepEqual(buildArgs('s', 'sonnet').slice(-2), ['--model', 'sonnet']);
});

test('cleanEnv removes keys that would bill the API instead of the plan', () => {
  const env = cleanEnv({ PATH: '/bin', ANTHROPIC_API_KEY: 'sk-x', ANTHROPIC_AUTH_TOKEN: 't', HOME: '/h' });
  assert.equal(env.ANTHROPIC_API_KEY, undefined);
  assert.equal(env.ANTHROPIC_AUTH_TOKEN, undefined);
  assert.equal(env.PATH, '/bin');
  assert.equal(env.HOME, '/h');
});

test('buildPrompt sends system text separately and flattens a conversation', () => {
  const single = buildPrompt({
    systemPrompt: 'Ground answers in the profile.',
    messages: [{ role: 'user', content: 'Draft an answer.' }],
  });
  assert.equal(single.system, 'Ground answers in the profile.');
  assert.equal(single.prompt, 'Draft an answer.');

  const multi = buildPrompt({
    messages: [
      { role: 'system', content: 'Be brief.' },
      { role: 'user', content: 'Hi' },
      { role: 'assistant', content: 'Hello' },
      { role: 'user', content: 'Shorter' },
    ],
  });
  assert.equal(multi.system, 'Be brief.');
  assert.equal(multi.prompt, 'User:\nHi\n\nAssistant:\nHello\n\nUser:\nShorter');

  const none = buildPrompt({ messages: [{ role: 'user', content: 'x' }] });
  assert.ok(none.system.length > 0, 'falls back to a default system prompt');
});

test('parseResult trims the answer and picks the model that wrote the most', () => {
  const parsed = parseResult(SUCCESS);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.text, 'A true, short answer.');
  assert.equal(parsed.model, 'claude-opus-4-7');
  assert.deepEqual(parsed.usage, { promptTokens: 120, completionTokens: 9, totalTokens: 129 });
  assert.equal(parseResult('not json').ok, false);
  assert.equal(parseResult(JSON.stringify({ subtype: 'success', is_error: true, result: 'x' })).ok, false);
});

test('findClaudeBinary prefers an explicit path, then PATH, then known folders', () => {
  const has = (paths: string[]) => (p: string) => paths.includes(p);
  assert.equal(findClaudeBinary('/custom/claude', '', has(['/custom/claude'])), '/custom/claude');
  assert.equal(findClaudeBinary(null, '/a:/b', has(['/b/claude'])), '/b/claude');
  assert.equal(findClaudeBinary(null, '', has(['/opt/homebrew/bin/claude'])), '/opt/homebrew/bin/claude');
  assert.equal(findClaudeBinary(null, '', has([])), null);
});

test('complete runs in an empty temp folder that is removed, with the prompt on stdin and no API key', async () => {
  await withFakeBinary(async (bin) => {
    const prev = process.env.ANTHROPIC_API_KEY;
    process.env.ANTHROPIC_API_KEY = 'sk-should-not-pass';
    let seenCwd = '';
    const runner: CliRunner = async (calledBin, args, opts) => {
      assert.equal(calledBin, bin);
      assert.equal(opts.stdin, 'Write one line.');
      assert.equal(opts.env.ANTHROPIC_API_KEY, undefined);
      assert.ok(existsSync(opts.cwd), 'runs inside a real, fresh folder');
      seenCwd = opts.cwd;
      assert.equal(args[args.indexOf('--system-prompt') + 1], 'Stay truthful.');
      return { code: 0, stdout: SUCCESS, stderr: '', timedOut: false };
    };
    try {
      const connector = new ClaudeCodeConnector(
        { provider: 'claude-code', tier: 'paid', model: 'default', baseUrl: bin },
        runner,
      );
      const res = await connector.complete({
        systemPrompt: 'Stay truthful.',
        messages: [{ role: 'user', content: 'Write one line.' }],
      });
      assert.equal(res.provider, 'claude-code');
      assert.equal(res.content, 'A true, short answer.');
      assert.equal(res.model, 'claude-opus-4-7');
      assert.equal(existsSync(seenCwd), false, 'temp folder is removed afterwards');
    } finally {
      if (prev === undefined) delete process.env.ANTHROPIC_API_KEY;
      else process.env.ANTHROPIC_API_KEY = prev;
    }
  });
});

test('complete reports Claude Code errors, timeouts and a missing program plainly', async () => {
  await withFakeBinary(async (bin) => {
    const config = { provider: 'claude-code' as const, tier: 'paid' as const, model: 'default', baseUrl: bin };
    const notSignedIn: CliRunner = async () => ({
      code: 1,
      stdout: JSON.stringify({ subtype: 'success', is_error: true, result: 'Not logged in. Please run /login' }),
      stderr: '',
      timedOut: false,
    });
    await assert.rejects(
      new ClaudeCodeConnector(config, notSignedIn).complete({ messages: [{ role: 'user', content: 'x' }] }),
      (err: unknown) => err instanceof AiProviderError && /Not logged in/.test(err.message),
    );
    const slow: CliRunner = async () => ({ code: null, stdout: '', stderr: '', timedOut: true });
    await assert.rejects(
      new ClaudeCodeConnector(config, slow, 1000).complete({ messages: [{ role: 'user', content: 'x' }] }),
      /took longer than 1 seconds/,
    );
  });
  const missing = new ClaudeCodeConnector({
    provider: 'claude-code',
    tier: 'paid',
    model: 'default',
    baseUrl: '/definitely/not/here/claude',
  });
  // Only meaningful where no real `claude` is installed; otherwise PATH finds it.
  if (!findClaudeBinary('/definitely/not/here/claude')) {
    await assert.rejects(missing.complete({ messages: [{ role: 'user', content: 'x' }] }), /not installed/);
  }
});

test('claudeCodeStatus reports sign-in and plan without the email', async () => {
  const runner: CliRunner = async (_bin, args) => {
    assert.deepEqual(args, ['auth', 'status']);
    return {
      code: 0,
      stdout: JSON.stringify({ loggedIn: true, email: 'someone@example.com', subscriptionType: 'max' }),
      stderr: '',
      timedOut: false,
    };
  };
  const status = await claudeCodeStatus(runner, '/fake/claude');
  assert.deepEqual(status, { found: true, loggedIn: true, plan: 'max', path: '/fake/claude' });
  assert.equal(JSON.stringify(status).includes('example.com'), false);
  assert.deepEqual(await claudeCodeStatus(runner, null), { found: false, loggedIn: false, plan: null, path: null });
});

test('the connector manager routes claude-code to the Claude Code connector', () => {
  const connector = loadConnector({ provider: 'claude-code', tier: 'paid', model: 'default' });
  assert.ok(connector instanceof ClaudeCodeConnector);
});
