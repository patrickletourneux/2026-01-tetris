import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import type { IErrorHandler } from '../domain/ports/IErrorHandler';

interface ErrorBoundaryProps {
  children: ReactNode;
  errorHandler: IErrorHandler;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * React Error Boundary catching rendering errors.
 * Displays a fallback UI and delegates error reporting to IErrorHandler.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.errorHandler.handleError(
      `${error.message} — ${info.componentStack}`,
      'React'
    );
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#0a0a0a',
          color: '#fff',
          gap: '16px'
        }}>
          <h2>Something went wrong</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
