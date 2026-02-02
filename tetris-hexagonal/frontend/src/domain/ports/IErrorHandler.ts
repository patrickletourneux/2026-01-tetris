/**
 * Port defining how the domain reports errors.
 * Implemented by an adapter in /adapters/error/.
 */
export interface IErrorHandler {
  handleError(error: string, context?: string): void;
}
