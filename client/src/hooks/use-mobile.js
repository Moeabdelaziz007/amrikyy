"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useMobile = (maxWidth = 768) => {
    const [isMobile, setIsMobile] = (0, react_1.useState)(window.innerWidth <= maxWidth);
    (0, react_1.useEffect)(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= maxWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [maxWidth]);
    return isMobile;
};
exports.default = useMobile;
