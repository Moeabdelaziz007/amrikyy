import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0f1e] via-[#1a1f2e] to-[#0a0f1e] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00f6ff] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff00f4] opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-[#00f6ff] to-[#ff00f4] shadow-[0_0_40px_rgba(0,246,255,0.5)]">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#00f6ff] to-[#ff00f4] bg-clip-text text-transparent">
            AuraOS
          </h1>
          <p className="text-[#a0a0a0] text-lg">
            Liquid Intelligence Desktop
          </p>
        </div>

        {/* Login Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-[#f0f0f0] mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-[#a0a0a0] text-center mb-8">
            Sign in to access your AI-powered workspace
          </p>
          
          {/* Google Sign In Button */}
          <button 
            onClick={signInWithGoogle}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-2xl bg-white hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center gap-3 px-6 py-4">
              <svg width="24" height="24" viewBox="0 0 24 24" className="flex-shrink-0">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-semibold text-lg">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </div>
            {loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
          </button>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[#00f6ff]/20 to-[#00f6ff]/5 flex items-center justify-center border border-[#00f6ff]/20">
                <span className="text-2xl">🔒</span>
              </div>
              <p className="text-xs text-[#a0a0a0]">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[#ff00f4]/20 to-[#ff00f4]/5 flex items-center justify-center border border-[#ff00f4]/20">
                <span className="text-2xl">⚡</span>
              </div>
              <p className="text-xs text-[#a0a0a0]">Fast</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-[#00ff88]/20 to-[#00ff88]/5 flex items-center justify-center border border-[#00ff88]/20">
                <span className="text-2xl">🤖</span>
              </div>
              <p className="text-xs text-[#a0a0a0]">AI-Powered</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#a0a0a0] mt-6">
          By signing in, you agree to our{' '}
          <span className="text-[#00f6ff] hover:underline cursor-pointer">Terms</span>
          {' '}and{' '}
          <span className="text-[#00f6ff] hover:underline cursor-pointer">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
