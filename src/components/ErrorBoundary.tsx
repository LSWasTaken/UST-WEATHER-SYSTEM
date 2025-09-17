import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false, errorMessage: null };
  }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return { hasError: true, errorMessage: message };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{this.state.errorMessage}</p>
            <button onClick={this.handleRetry} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Reload</button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


