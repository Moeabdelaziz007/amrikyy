"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = AuthProvider;
exports.useAuth = useAuth;
const react_1 = require("react");
const firebase_1 = require("@/lib/firebase");
const AuthContext = (0, react_1.createContext)(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const unsubscribe = firebase_1.AuthService.onAuthStateChanged((user) => {
            // Check for existing guest user
            const isGuestUser = localStorage.getItem('isGuestUser') === 'true';
            const guestUserData = localStorage.getItem('guestUser');

            if (user) {
                // Real Firebase user
                setUser(user);
                setLoading(false);
            } else if (isGuestUser && guestUserData) {
                // Guest user
                const guestUser = JSON.parse(guestUserData);
                setUser(guestUser);
                setLoading(false);
            } else {
                // No user
                setUser(null);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);
    const signInWithGoogle = async () => {
        try {
            setLoading(true);
            await firebase_1.AuthService.signInWithGoogle();
        }
        catch (error) {
            console.error('Sign-in error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const signInAsGuest = async () => {
        try {
            setLoading(true);
            // Create a guest user object
            const guestUser = {
                uid: 'guest-' + Date.now(),
                email: 'guest@auraos.com',
                displayName: 'Guest User',
                photoURL: null,
                emailVerified: false,
                isAnonymous: true
            };

            // Store guest info in localStorage
            localStorage.setItem('isGuestUser', 'true');
            localStorage.setItem('guestUser', JSON.stringify(guestUser));

            setUser(guestUser);
        }
        catch (error) {
            console.error('Guest sign-in error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const signInWithEmail = async (email: string, password: string) => {
        try {
            setLoading(true);
            await firebase_1.AuthService.signInWithEmail(email, password);
        }
        catch (error) {
            console.error('Email sign-in error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };

    const signUpWithEmail = async (email: string, password: string, displayName?: string) => {
        try {
            setLoading(true);
            await firebase_1.AuthService.signUpWithEmail(email, password, displayName);
        }
        catch (error) {
            console.error('Email sign-up error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const signOut = async () => {
        try {
            setLoading(true);

            // Check if current user is guest
            const isGuestUser = localStorage.getItem('isGuestUser') === 'true';

            if (isGuestUser) {
                // Clear guest user data
                localStorage.removeItem('isGuestUser');
                localStorage.removeItem('guestUser');
                setUser(null);
            } else {
                // Real Firebase user
                await firebase_1.AuthService.signOut();
            }
        }
        catch (error) {
            console.error('Sign-out error:', error);
            throw error;
        }
        finally {
            setLoading(false);
        }
    };
    const value = {
        user,
        loading,
        signInWithGoogle,
        signInAsGuest,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        isAuthenticated: !!user
    };
    return (<AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>);
}
function useAuth() {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
