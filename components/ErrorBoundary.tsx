
'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { config } from '@/lib/config';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'component' | 'critical';
}

interface ErrorFallbackProps {
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
  resetError: () => void;
  level?: 'page' | 'component' | 'critical';
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { 
      hasError: true, 
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({ errorInfo });
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log error to external service in production
    if (config.isProduction()) {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = async (error: Error, errorInfo: ErrorInfo) => {
    try {
      // In a real application, you would send this to your error tracking service
      // like Sentry, LogRocket, or Bugsnag
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        errorId: this.state.errorId,
      };

      // Example: Send to your error tracking service
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData),
      // });
      
      console.log('Error logged to service:', errorData);
    } catch (loggingError) {
      console.error('Failed to log error to service:', loggingError);
    }
  };

  resetError = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      errorId: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          resetError={this.resetError}
          level={this.props.level || 'page'}
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  errorInfo, 
  errorId, 
  resetError, 
  level = 'page' 
}) => {
  const isPageLevel = level === 'page';
  const isCritical = level === 'critical';

  if (isCritical) {
    return <CriticalErrorFallback error={error} errorId={errorId} />;
  }

  if (isPageLevel) {
    return <PageErrorFallback error={error} errorInfo={errorInfo} errorId={errorId} resetError={resetError} />;
  }

  return <ComponentErrorFallback error={error} resetError={resetError} />;
};

const CriticalErrorFallback: React.FC<{ error?: Error; errorId?: string }> = ({ error, errorId }) => (
  <div className="min-h-screen flex items-center justify-center bg-red-50">
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <CardTitle className="text-red-900">Critical System Error</CardTitle>
        <CardDescription className="text-red-700">
          A critical error has occurred. Please contact support immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorId && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Error ID: {errorId}</p>
          </div>
        )}
        <div className="flex flex-col space-y-2">
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full"
            variant="outline"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const PageErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, errorId, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <Card className="w-full max-w-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
        </div>
        <CardTitle>Something went wrong</CardTitle>
        <CardDescription>
          We're sorry, but something unexpected happened. Please try again.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorId && (
          <div className="text-center">
            <p className="text-sm text-gray-600">Error ID: {errorId}</p>
          </div>
        )}
        
        {config.debug.enabled && error && (
          <details className="bg-gray-100 rounded-lg p-4">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center">
              <Bug className="w-4 h-4 mr-2" />
              Error Details
            </summary>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs font-medium text-gray-600">Message:</p>
                <p className="text-xs text-gray-800 font-mono bg-white p-2 rounded border">
                  {error.message}
                </p>
              </div>
              {error.stack && (
                <div>
                  <p className="text-xs font-medium text-gray-600">Stack Trace:</p>
                  <pre className="text-xs text-gray-800 bg-white p-2 rounded border overflow-auto max-h-32">
                    {error.stack}
                  </pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <p className="text-xs font-medium text-gray-600">Component Stack:</p>
                  <pre className="text-xs text-gray-800 bg-white p-2 rounded border overflow-auto max-h-32">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        <div className="flex flex-col space-y-2">
          <Button onClick={resetError} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
);

const ComponentErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ error, resetError }) => (
  <div className="border border-red-200 rounded-lg p-4 bg-red-50">
    <div className="flex items-center space-x-2 mb-2">
      <AlertTriangle className="w-4 h-4 text-red-600" />
      <h3 className="text-sm font-medium text-red-800">Component Error</h3>
    </div>
    <p className="text-sm text-red-700 mb-3">
      This component encountered an error and couldn't render properly.
    </p>
    {config.debug.enabled && error && (
      <details className="mb-3">
        <summary className="cursor-pointer text-xs text-red-600 hover:text-red-800">
          Show error details
        </summary>
        <pre className="mt-1 text-xs text-red-800 bg-white p-2 rounded border overflow-auto">
          {error.message}
        </pre>
      </details>
    )}
    <Button 
      onClick={resetError} 
      size="sm" 
      variant="outline"
      className="text-red-700 border-red-300 hover:bg-red-100"
    >
      <RefreshCw className="w-3 h-3 mr-1" />
      Retry
    </Button>
  </div>
);

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    
    // In a real application, you would send this to your error tracking service
    if (config.isProduction()) {
      // Log to error tracking service
      console.log('Error logged to service:', { error: error.message, errorInfo });
    }
  }, []);

  return { handleError };
};

// Higher-order component for error handling
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
