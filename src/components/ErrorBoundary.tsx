import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('游戏发生错误:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
          <div className="bg-gray-800 rounded-xl p-8 max-w-lg w-full border border-red-800">
            <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ 游戏发生错误</h1>
            <p className="text-gray-300 mb-4">
              游戏遇到了意外问题，请尝试刷新页面重新开始。
            </p>
            <pre className="bg-gray-900 p-4 rounded text-sm text-red-300 mb-6 overflow-auto max-h-40">
              {this.state.error?.message || '未知错误'}
            </pre>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              刷新游戏
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;