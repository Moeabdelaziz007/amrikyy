"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const react_1 = require("react");
const use_auth_1 = require("@/hooks/use-auth");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const alert_1 = require("@/components/ui/alert");
const separator_1 = require("@/components/ui/separator");
const tooltip_1 = require("@/components/ui/tooltip");
const FloatingParticles = () => (<div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(30)].map((_, i) => (<div key={i} className="absolute bg-gradient-to-r from-primary/30 via-accent/20 to-primary/30 rounded-full animate-float" style={{
            width: `${Math.random() * 40 + 15}px`,
            height: `${Math.random() * 40 + 15}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 25 + 20}s`,
            animationDelay: `${Math.random() * -30}s`,
            boxShadow: `0 0 ${Math.random() * 20 + 10}px hsl(var(--primary))`,
        }}></div>))}
  </div>);
const MatrixRain = () => (<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
    {[...Array(50)].map((_, i) => (<div key={i} className="absolute text-primary/20 font-mono text-xs animate-matrix-rain" style={{
            left: `${(i * 2) % 100}%`,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * -5}s`,
        }}>
        {String.fromCharCode(0x30A0 + Math.random() * 96)}
      </div>))}
  </div>);
const CyberGrid = () => (<div className="absolute inset-0 pointer-events-none opacity-20">
    <svg className="w-full h-full">
      <defs>
        <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
          <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>
    </svg>
  </div>);
function LoginPage() {
    const { signInWithGoogle, loading } = (0, use_auth_1.useAuth)();
    const [error, setError] = (0, react_1.useState)(null);
    const [isSigningIn, setIsSigningIn] = (0, react_1.useState)(false);
    const handleGoogleSignIn = async () => {
        try {
            setError(null);
            setIsSigningIn(true);
            await signInWithGoogle();
        }
        catch (error) {
            setError(error.message || 'Failed to sign in with Google');
        }
        finally {
            setIsSigningIn(false);
        }
    };
    return (<div className="min-h-screen bg-gradient-to-br from-background via-carbon-900 to-background flex items-center justify-center p-4 relative overflow-hidden">
      <FloatingParticles />
      <MatrixRain />
      <CyberGrid />

      <div className="w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12 transition-all duration-700 hover:rotate-0 hover:scale-110 shadow-2xl neon-glow-md animate-pulse-slow">
            <i className="fas fa-robot text-white text-4xl animate-bounce-slow"></i>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-2 cyber-text animate-neon-flicker">AuraOS</h1>
          <p className="text-xl text-muted-foreground animate-fade-in-up-delayed">The Future of AI-Powered Automation</p>
        </div>

        {/* Login Card */}
        <card_1.Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-md transform-gpu transition-all duration-700 hover:scale-105 hover:shadow-neon-lg [transform-style:preserve-3d] animate-slide-in-up glass-card">
          <card_1.CardHeader className="text-center pb-4">
            <card_1.CardTitle className="text-2xl font-semibold neon-text">Unlock Your AI Potential</card_1.CardTitle>
            <p className="text-muted-foreground animate-fade-in">
              Sign in to access your intelligent automation dashboard
            </p>
          </card_1.CardHeader>

          <card_1.CardContent className="space-y-6">
            {error && (<alert_1.Alert variant="destructive">
                <alert_1.AlertDescription>{error}</alert_1.AlertDescription>
              </alert_1.Alert>)}

            {/* Google Sign In Button */}
            <button_1.Button onClick={handleGoogleSignIn} disabled={isSigningIn || loading} className="w-full h-14 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl neon-button animate-pulse-gentle">
              {isSigningIn ? (<>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  Authenticating...
                </>) : (<>
                  <i className="fab fa-google text-2xl mr-4"></i>
                  Continue with Google
                </>)}
            </button_1.Button>

            <div className="flex items-center justify-center space-x-2">
              <button_1.Button variant="link" className="text-xs text-muted-foreground">Sign in as Guest</button_1.Button>
              <separator_1.Separator orientation="vertical" className="h-4"/>
              <button_1.Button variant="link" className="text-xs text-muted-foreground">Sign up for a free trial</button_1.Button>
            </div>

            <separator_1.Separator className="my-6">
              <span className="text-xs text-muted-foreground bg-card px-2">or</span>
            </separator_1.Separator>

            {/* Features Preview with Tooltips */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground text-center">Unlock cutting-edge features:</h3>
              <tooltip_1.TooltipProvider>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <tooltip_1.Tooltip>
                    <tooltip_1.TooltipTrigger className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <i className="fas fa-robot text-primary"></i>
                      <span>Autonomous AI Agents</span>
                    </tooltip_1.TooltipTrigger>
                    <tooltip_1.TooltipContent>
                      <p>Deploy AI agents that learn and adapt to automate complex tasks.</p>
                    </tooltip_1.TooltipContent>
                  </tooltip_1.Tooltip>
                  <tooltip_1.Tooltip>
                    <tooltip_1.TooltipTrigger className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <i className="fas fa-cogs text-accent"></i>
                      <span>Self-Improving Workflows</span>
                    </tooltip_1.TooltipTrigger>
                    <tooltip_1.TooltipContent>
                      <p>Create workflows that optimize themselves for maximum efficiency.</p>
                    </tooltip_1.TooltipContent>
                  </tooltip_1.Tooltip>
                  <tooltip_1.Tooltip>
                    <tooltip_1.TooltipTrigger className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <i className="fas fa-brain text-green-500"></i>
                      <span>Predictive Analytics</span>
                    </tooltip_1.TooltipTrigger>
                    <tooltip_1.TooltipContent>
                      <p>Gain insights into future trends and make data-driven decisions.</p>
                    </tooltip_1.TooltipContent>
                  </tooltip_1.Tooltip>
                  <tooltip_1.Tooltip>
                    <tooltip_1.TooltipTrigger className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                      <i className="fas fa-users text-purple-500"></i>
                      <span>Collaborative AI</span>
                    </tooltip_1.TooltipTrigger>
                    <tooltip_1.TooltipContent>
                      <p>Enable multiple AI agents to collaborate on complex projects.</p>
                    </tooltip_1.TooltipContent>
                  </tooltip_1.Tooltip>
                </div>
              </tooltip_1.TooltipProvider>
            </div>

            {/* Testimonials */}
            <div className="pt-4">
                <h3 className="text-sm font-medium text-foreground text-center mb-2">Trusted by innovators:</h3>
                <blockquote className="text-center text-xs text-muted-foreground italic">
                    "AuraOS has transformed our workflow, saving us countless hours and delivering incredible results."
                    <footer className="mt-1 not-italic font-semibold">- CEO of a leading tech company</footer>
                </blockquote>
            </div>

            {/* Security and Trust */}
            <div className="text-center pt-4">
              <span className="inline-flex items-center text-xs text-muted-foreground">
                <i className="fas fa-lock text-green-500 mr-2"></i>
                Secure sign-in powered by Firebase Authentication
              </span>
            </div>

          </card_1.CardContent>
        </card_1.Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}
            and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Your data is protected with end-to-end encryption and advanced security protocols.
          </p>
        </div>
      </div>
    </div>);
}
