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
    return <>{children}</>;
}
