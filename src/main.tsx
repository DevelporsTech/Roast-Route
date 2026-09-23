import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Uncaught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-coffee-50 dark:bg-[#120B08] text-coffee-950 dark:text-cream-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-coffee-950/80 rounded-3xl p-8 border border-coffee-200 dark:border-coffee-800 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-roast-amber flex items-center justify-center text-3xl shadow-inner">
              ☕
            </div>
            <h1 className="text-xl font-serif font-bold text-coffee-950 dark:text-cream-50">
              Roast &amp; Route
            </h1>
            <p className="text-xs text-coffee-600 dark:text-coffee-300">
              Something unexpected happened while rendering. Click below to reload fresh.
            </p>
            {this.state.error && (
              <pre className="text-[10px] text-left p-3 rounded-xl bg-coffee-100 dark:bg-coffee-900 overflow-x-auto text-coffee-800 dark:text-coffee-200">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-3 rounded-xl bg-coffee-900 dark:bg-roast-amber text-white dark:text-coffee-950 font-bold text-xs shadow-md hover:opacity-90 transition-all"
            >
              Reset &amp; Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
