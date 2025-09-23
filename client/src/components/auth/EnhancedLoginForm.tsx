import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Checkbox } from '../ui/checkbox';
import { 
  LogIn, 
  User, 
  Lock, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Shield, 
  Smartphone,
  Mail,
  Key,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../hooks/use-auth';

interface EnhancedLoginFormProps {
  onSuccess?: (user: any) => void;
  onCancel?: () => void;
  showGuestMode?: boolean;
}

export const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({
  onSuccess,
  onCancel,
  showGuestMode = true,
}) => {
  const { signInWithEmail, signInWithGoogle, signInAsGuest, loading } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Security features
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  
  // Form validation
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if form is valid
  useEffect(() => {
    const emailValid = email.includes('@') && email.length > 5;
    const passwordValid = password.length >= 6;
    setIsFormValid(emailValid && passwordValid);
  }, [email, password]);

  // Check lockout status
  useEffect(() => {
    const checkLockout = () => {
      const storedAttempts = localStorage.getItem('loginAttempts');
      const storedLockout = localStorage.getItem('lockoutTime');
      
      if (storedAttempts) {
        setLoginAttempts(parseInt(storedAttempts));
      }
      
      if (storedLockout) {
        const lockout = new Date(storedLockout);
        if (lockout > new Date()) {
          setIsLocked(true);
          setLockoutTime(lockout);
        } else {
          localStorage.removeItem('lockoutTime');
          localStorage.removeItem('loginAttempts');
        }
      }
    };
    
    checkLockout();
  }, []);

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Password validation
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('Account temporarily locked. Please try again later.');
      return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await signInWithEmail(email, password);
      
      // Reset login attempts on success
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('lockoutTime');
      setLoginAttempts(0);
      setIsLocked(false);
      
      setSuccess('Login successful! Redirecting...');
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      }
      
      if (onSuccess) {
        onSuccess({ email, name: 'User' });
      } else {
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      }
      
    } catch (error: any) {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        const lockout = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        setIsLocked(true);
        setLockoutTime(lockout);
        localStorage.setItem('lockoutTime', lockout.toISOString());
        setError('Too many failed attempts. Account locked for 15 minutes.');
      } else {
        setError(error.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await signInWithGoogle();
      setSuccess('Google sign-in successful!');
    } catch (error: any) {
      setError(error.message || 'Google sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle guest sign in
  const handleGuestSignIn = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await signInAsGuest();
      setSuccess('Guest mode activated!');
    } catch (error: any) {
      setError(error.message || 'Guest sign-in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load remembered email
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  // Security status indicator
  const getSecurityStatus = () => {
    if (isLocked) return { color: 'text-red-500', text: 'Account Locked', icon: AlertTriangle };
    if (loginAttempts >= 3) return { color: 'text-yellow-500', text: 'High Risk', icon: AlertTriangle };
    if (loginAttempts > 0) return { color: 'text-orange-500', text: 'Warning', icon: AlertTriangle };
    return { color: 'text-green-500', text: 'Secure', icon: CheckCircle };
  };

  const securityStatus = getSecurityStatus();
  const SecurityIcon = securityStatus.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
      </div>
      
      <div className="w-full max-w-md z-10">
        {/* Security Status */}
        <div className="mb-6 text-center">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm ${securityStatus.color}`}>
            <SecurityIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{securityStatus.text}</span>
          </div>
        </div>

        {/* Main Login Card */}
        <Card className="shadow-2xl border-0 bg-black/40 backdrop-blur-md">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-500">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Secure Login
            </CardTitle>
            <CardDescription className="text-gray-300">
              Access your AuraOS dashboard with enhanced security
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-red-200">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-900/50 border-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-green-200">{success}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) validateEmail(e.target.value);
                    }}
                    className="pl-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                </div>
                {emailError && (
                  <p className="text-sm text-red-400">{emailError}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) validatePassword(e.target.value);
                    }}
                    className="pl-10 pr-10 bg-black/20 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500"
                    required
                    disabled={isSubmitting || isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                    disabled={isSubmitting || isLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    disabled={isSubmitting || isLocked}
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-300">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-purple-400 hover:text-purple-300 p-0 h-auto"
                  disabled={isSubmitting || isLocked}
                >
                  Forgot password?
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3"
                disabled={!isFormValid || isSubmitting || isLocked}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Alternative Sign-in Methods */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-black/40 px-2 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-in */}
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full bg-white/10 border-gray-600 text-white hover:bg-white/20"
                disabled={isSubmitting || isLocked}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              {/* Guest Mode */}
              {showGuestMode && (
                <Button
                  onClick={handleGuestSignIn}
                  variant="outline"
                  className="w-full bg-green-900/20 border-green-600 text-green-400 hover:bg-green-900/30"
                  disabled={isSubmitting || isLocked}
                >
                  <User className="mr-2 h-4 w-4" />
                  Continue as Guest
                </Button>
              )}
            </div>

            {/* Security Features */}
            <div className="pt-4 border-t border-gray-600">
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3" />
                  <span>2FA Ready</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Key className="h-3 w-3" />
                  <span>Encrypted</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Smartphone className="h-3 w-3" />
                  <span>Mobile Ready</span>
                </div>
              </div>
            </div>

            {/* Lockout Timer */}
            {isLocked && lockoutTime && (
              <div className="text-center text-sm text-red-400">
                Account locked until {lockoutTime.toLocaleTimeString()}
              </div>
            )}

            {/* Demo Credentials */}
            <div className="mt-6 p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
              <p className="text-xs text-blue-300 text-center mb-2">Demo Credentials:</p>
              <div className="text-xs text-blue-200 font-mono text-center">
                <div>Email: admin@auraos.com</div>
                <div>Password: any password (6+ chars)</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our{' '}
            <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoginForm;
