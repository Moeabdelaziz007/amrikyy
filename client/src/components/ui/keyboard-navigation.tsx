"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMON_SHORTCUTS = void 0;
exports.KeyboardNavigation = KeyboardNavigation;
exports.FocusManager = FocusManager;
exports.KeyboardShortcuts = KeyboardShortcuts;
exports.SkipLink = SkipLink;
exports.KeyboardHint = KeyboardHint;
exports.useFocusManagement = useFocusManagement;
const react_1 = require("react");
const utils_1 = require("@/lib/utils");
function KeyboardNavigation({ children, className, onNavigate, enabled = true }) {
    const containerRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (!enabled)
            return;
        const handleKeyDown = (event) => {
            const { key, ctrlKey, altKey, metaKey } = event;
            // Ignore if modifier keys are pressed (except for specific shortcuts)
            if (ctrlKey || altKey || metaKey) {
                return;
            }
            let direction = null;
            switch (key) {
                case 'ArrowUp':
                    direction = 'up';
                    break;
                case 'ArrowDown':
                    direction = 'down';
                    break;
                case 'ArrowLeft':
                    direction = 'left';
                    break;
                case 'ArrowRight':
                    direction = 'right';
                    break;
                case 'Enter':
                case ' ':
                    direction = 'enter';
                    break;
                case 'Escape':
                    direction = 'escape';
                    break;
                default:
                    return;
            }
            if (direction && onNavigate) {
                event.preventDefault();
                onNavigate(direction);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [enabled, onNavigate]);
    return (<div ref={containerRef} className={(0, utils_1.cn)(className)}>
      {children}
    </div>);
}
function FocusManager({ children, className, trapFocus = false, restoreFocus = true }) {
    const containerRef = (0, react_1.useRef)(null);
    const previousActiveElement = (0, react_1.useRef)(null);
    const [focusableElements, setFocusableElements] = (0, react_1.useState)([]);
    const getFocusableElements = (0, react_1.useCallback)(() => {
        if (!containerRef.current)
            return [];
        const focusableSelectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex="-1"])',
            '[contenteditable="true"]'
        ].join(', ');
        const elements = Array.from(containerRef.current.querySelectorAll(focusableSelectors));
        return elements
            .map((element, index) => ({
            element,
            tabIndex: element.tabIndex || 0,
            order: element.tabIndex || index + 1
        }))
            .sort((a, b) => a.order - b.order);
    }, []);
    (0, react_1.useEffect)(() => {
        if (trapFocus) {
            previousActiveElement.current = document.activeElement;
        }
        const elements = getFocusableElements();
        setFocusableElements(elements);
        if (trapFocus && elements.length > 0) {
            elements[0].element.focus();
        }
        return () => {
            if (restoreFocus && trapFocus && previousActiveElement.current) {
                previousActiveElement.current.focus();
            }
        };
    }, [trapFocus, restoreFocus, getFocusableElements]);
    (0, react_1.useEffect)(() => {
        if (!trapFocus)
            return;
        const handleKeyDown = (event) => {
            if (event.key === 'Tab') {
                const firstElement = focusableElements[0]?.element;
                const lastElement = focusableElements[focusableElements.length - 1]?.element;
                if (event.shiftKey) {
                    // Shift + Tab: move backwards
                    if (document.activeElement === firstElement) {
                        event.preventDefault();
                        lastElement?.focus();
                    }
                }
                else {
                    // Tab: move forwards
                    if (document.activeElement === lastElement) {
                        event.preventDefault();
                        firstElement?.focus();
                    }
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [trapFocus, focusableElements]);
    return (<div ref={containerRef} className={className}>
      {children}
    </div>);
}
function KeyboardShortcuts({ shortcuts, children, className, enabled = true }) {
    (0, react_1.useEffect)(() => {
        if (!enabled)
            return;
        const handleKeyDown = (event) => {
            const { key, ctrlKey, altKey, metaKey, shiftKey } = event;
            // Build shortcut string
            const modifiers = [];
            if (ctrlKey || metaKey)
                modifiers.push('ctrl');
            if (altKey)
                modifiers.push('alt');
            if (shiftKey)
                modifiers.push('shift');
            const shortcutKey = [...modifiers, key.toLowerCase()].join('+');
            if (shortcuts[shortcutKey]) {
                event.preventDefault();
                shortcuts[shortcutKey]();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
    return <div className={className}>{children}</div>;
}
function SkipLink({ href, children, className }) {
    return (<a href={href} className={(0, utils_1.cn)("sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4", "z-50 px-4 py-2 bg-primary text-primary-foreground rounded-md", "neon-glow-sm transition-all duration-200", className)}>
      {children}
    </a>);
}
function KeyboardHint({ hint, className }) {
    return (<div className={(0, utils_1.cn)("text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded", "border border-border/50", className)}>
      {hint}
    </div>);
}
// Hook for managing focus
function useFocusManagement() {
    const [focusedIndex, setFocusedIndex] = (0, react_1.useState)(-1);
    const elementsRef = (0, react_1.useRef)([]);
    const registerElement = (0, react_1.useCallback)((element, index) => {
        if (element) {
            elementsRef.current[index] = element;
        }
    }, []);
    const focusElement = (0, react_1.useCallback)((index) => {
        if (elementsRef.current[index]) {
            elementsRef.current[index].focus();
            setFocusedIndex(index);
        }
    }, []);
    const focusNext = (0, react_1.useCallback)(() => {
        const nextIndex = Math.min(focusedIndex + 1, elementsRef.current.length - 1);
        focusElement(nextIndex);
    }, [focusedIndex, focusElement]);
    const focusPrevious = (0, react_1.useCallback)(() => {
        const prevIndex = Math.max(focusedIndex - 1, 0);
        focusElement(prevIndex);
    }, [focusedIndex, focusElement]);
    const focusFirst = (0, react_1.useCallback)(() => {
        focusElement(0);
    }, [focusElement]);
    const focusLast = (0, react_1.useCallback)(() => {
        focusElement(elementsRef.current.length - 1);
    }, [focusElement]);
    return {
        focusedIndex,
        registerElement,
        focusElement,
        focusNext,
        focusPrevious,
        focusFirst,
        focusLast
    };
}
// Common keyboard shortcuts
exports.COMMON_SHORTCUTS = {
    'ctrl+k': () => {
        // Open search or command palette
        console.log('Opening search/command palette');
    },
    'ctrl+/': () => {
        // Show keyboard shortcuts help
        console.log('Showing keyboard shortcuts');
    },
    'escape': () => {
        // Close modals, dropdowns, etc.
        const activeElement = document.activeElement;
        if (activeElement?.blur) {
            activeElement.blur();
        }
    },
    'ctrl+enter': () => {
        // Submit forms or confirm actions
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.click();
        }
    }
};
