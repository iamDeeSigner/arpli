// Shape of an application error surfaced through ErrorToast.
// Ported from cloudlands-fe's error-handler; only the type is needed here.
export interface AppError {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
  stack?: string;
  recoverable: boolean;
  action?: {
    label: string;
    handler: () => void | Promise<void>;
  };
  formattedMessage?: string;
}
