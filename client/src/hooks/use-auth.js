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
            setUser(user);
            setLoading(false);
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
    const signOut = async () => {
        try {
            setLoading(true);
            await firebase_1.AuthService.signOut();
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
