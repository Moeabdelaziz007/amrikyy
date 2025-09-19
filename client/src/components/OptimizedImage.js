"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const OptimizedImage = ({ src, alt, className, placeholder }) => {
    const [isLoaded, setIsLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
    }, [src]);
    return isLoaded ? (<img src={src} alt={alt} className={className}/>) : (<div className={`placeholder ${className}`}>{placeholder}</div>);
};
exports.default = OptimizedImage;
