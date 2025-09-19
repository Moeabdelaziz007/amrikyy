"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundary = void 0;
exports.withErrorBoundary = withErrorBoundary;
const react_1 = require("react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const lucide_react_1 = require("lucide-react");
class ErrorBoundary extends react_1.Component {
    state = {
        hasError: false,
        error: null,
    };
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Log error to console
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ error });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    handleReload = () => {
        window.location.reload();
    };
    handleGoHome = () => {
        window.location.href = '/';
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (<div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <card_1.Card className="glass-card neon-glow-md max-w-2xl w-full">
            <card_1.CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <lucide_react_1.AlertTriangle className="h-8 w-8 text-destructive"/>
              </div>
              <card_1.CardTitle className="text-2xl cyber-text">Oops! Something went wrong</card_1.CardTitle>
              <p className="text-muted-foreground mt-2">
                An unexpected error occurred. Our team has been notified.
              </p>
            </card_1.CardHeader>
            
            <card_1.CardContent className="space-y-6">
              {process.env.NODE_ENV === 'development' && this.state.error && (<div className="space-y-3">
                  <h4 className="font-medium text-foreground">Error Details:</h4>
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                    <code className="text-sm text-destructive break-all">
                      {this.state.error.message}
                    </code>
                  </div>
                </div>)}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button_1.Button onClick={this.handleReset} variant="default" className="neon-button">
                  <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
                  Try Again
                </button_1.Button>
                <button_1.Button onClick={this.handleReload} variant="outline" className="neon-glow-sm">
                  <lucide_react_1.RefreshCw className="h-4 w-4 mr-2"/>
                  Reload Page
                </button_1.Button>
                <button_1.Button onClick={this.handleGoHome} variant="ghost">
                  <lucide_react_1.Home className="h-4 w-4 mr-2"/>
                  Go Home
                </button_1.Button>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                <p>If the problem persists, please contact support.</p>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>);
        }
        return this.props.children;
    }
}
exports.ErrorBoundary = ErrorBoundary;
function withErrorBoundary(Component, fallback) {
    return function WrappedComponent(props) {
        return (<ErrorBoundary fallback={fallback}>
        <Component {...props}/>
      </ErrorBoundary>);
    };
}
