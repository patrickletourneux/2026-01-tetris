import type { IErrorHandler } from '../../domain/ports/IErrorHandler';

/**
 * Adapter implementing IErrorHandler with console logging.
 * Can be replaced with a remote monitoring service.
 */
export class ConsoleErrorHandler implements IErrorHandler {
  handleError(error: string, context?: string): void {
    const prefix = context ? `[${context}]` : '[Error]';
    console.error(`${prefix} ${error}`);
  }
}
