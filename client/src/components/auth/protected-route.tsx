"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProtectedRoute;
const use_auth_1 = require("@/hooks/use-auth");
const loading_1 = require("@/pages/loading");
const login_1 = require("@/pages/login");
function ProtectedRoute({ children }) {
    const { user, loading, isAuthenticated } = (0, use_auth_1.useAuth)();
    if (loading) {
        return <loading_1.default />;
    }
    if (!isAuthenticated) {
        return <login_1.default />;
    }

    // Show guest mode indicator for guest users
    const isGuestUser = user?.isAnonymous || localStorage.getItem('isGuestUser') === 'true';

    return (
        <>
            {isGuestUser && (
                <div className="bg-yellow-100 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 px-4 py-2 text-center">
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        <i className="fas fa-user mr-2"></i>
                        You're using Guest Mode. <a href="/login" className="underline hover:no-underline">Sign in</a> for full features.
                    </span>
                </div>
            )}
            {children}
        </>
    );
}
