"use strict";
// Page Tracker Component
// Automatically tracks page navigation and user interactions
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageTracker = PageTracker;
exports.useRouterTracking = useRouterTracking;
exports.withPageTracking = withPageTracking;
const react_1 = require("react");
const wouter_1 = require("wouter");
const use_user_history_1 = require("../../hooks/use-user-history");
/**
 * Higher-order component that automatically tracks page views
 */
function PageTracker({ pageName, children }) {
    (0, use_user_history_1.usePageTracking)(pageName);
    return <>{children}</>;
}
/**
 * Hook for tracking page navigation with wouter router
 */
function useRouterTracking() {
    const [location] = (0, wouter_1.useLocation)();
    const previousLocation = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (previousLocation.current && previousLocation.current !== location) {
            // Track navigation between pages
            console.log(`Navigation: ${previousLocation.current} -> ${location}`);
        }
        previousLocation.current = location;
    }, [location]);
}
/**
 * Component to wrap pages for automatic tracking
 */
function withPageTracking(WrappedComponent, pageName) {
    return function TrackedPage(props) {
        return (<PageTracker pageName={pageName}>
        <WrappedComponent {...props}/>
      </PageTracker>);
    };
}
exports.default = PageTracker;
