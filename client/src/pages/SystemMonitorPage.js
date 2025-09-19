"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemMonitorPage = void 0;
const react_1 = require("react");
const SystemMonitor_1 = require("@/components/monitoring/SystemMonitor");
const SystemMonitorPage = () => {
    return (<div className="container mx-auto px-4 py-8">
      <SystemMonitor_1.SystemMonitor />
    </div>);
};
exports.SystemMonitorPage = SystemMonitorPage;
exports.default = exports.SystemMonitorPage;
