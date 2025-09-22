'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const react_router_dom_1 = require('react-router-dom');
const DebugView_1 = require('./pages/DebugView');
const Workspace_1 = require('./pages/Workspace');
const advanced_ai_tools_1 = require('./pages/advanced-ai-tools');
const ai_agents_1 = require('./pages/ai-agents');
const dashboard_1 = require('./pages/dashboard');
const loading_1 = require('./pages/loading');
const login_1 = require('./pages/login');
const not_found_1 = require('./pages/not-found');
const smart_learning_1 = require('./pages/smart-learning');
const social_feed_1 = require('./pages/social-feed');
const telegram_1 = require('./pages/telegram');
const workflows_1 = require('./pages/workflows');
const ai_travel_agency_1 = require('./pages/ai-travel-agency');
const AllRoutes = () => (
  <react_router_dom_1.BrowserRouter>
    <react_router_dom_1.Routes>
      <react_router_dom_1.Route path="/login" element={<login_1.default />} />
      <react_router_dom_1.Route path="/" element={<dashboard_1.default />} />
      <react_router_dom_1.Route
        path="/workspace"
        element={<Workspace_1.default />}
      />
      <react_router_dom_1.Route
        path="/advanced-ai-tools"
        element={<advanced_ai_tools_1.default />}
      />
      <react_router_dom_1.Route
        path="/ai-agents"
        element={<ai_agents_1.default />}
      />
      <react_router_dom_1.Route
        path="/smart-learning"
        element={<smart_learning_1.default />}
      />
      <react_router_dom_1.Route
        path="/social-feed"
        element={<social_feed_1.default />}
      />
      <react_router_dom_1.Route
        path="/telegram"
        element={<telegram_1.default />}
      />
      <react_router_dom_1.Route
        path="/workflows"
        element={<workflows_1.default />}
      />
      <react_router_dom_1.Route
        path="/ai-travel-agency"
        element={<ai_travel_agency_1.default />}
      />
      <react_router_dom_1.Route
        path="/debug"
        element={<DebugView_1.default />}
      />
      <react_router_dom_1.Route
        path="/loading"
        element={<loading_1.default />}
      />
      <react_router_dom_1.Route path="*" element={<not_found_1.default />} />
    </react_router_dom_1.Routes>
  </react_router_dom_1.BrowserRouter>
);
exports.default = AllRoutes;
