import React from 'react';
import { EnhancedLoginForm } from '../components/auth/EnhancedLoginForm';
import { EnhancedAuthProvider } from '../hooks/use-enhanced-auth';
function LoginPage() {
  const handleLoginSuccess = (user: any) => {
    console.log('Login successful:', user);
    // Redirect to dashboard or handle success
    window.location.href = '/dashboard';
  };
  return (
    <EnhancedAuthProvider>
      <EnhancedLoginForm 
        onSuccess={handleLoginSuccess}
        showGuestMode={true}
      />
    </EnhancedAuthProvider>
  );
}

export default LoginPage;
