"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClient = exports.getQueryFn = void 0;
exports.apiRequest = apiRequest;
const react_query_1 = require("@tanstack/react-query");
const error_handling_1 = require("./error-handling");
async function throwIfResNotOk(res) {
    if (!res.ok) {
        const text = (await res.text()) || res.statusText;
        // Create a mock error object that matches axios error structure
        const error = {
            response: {
                status: res.status,
                data: { message: text }
            },
            request: null,
            message: text,
            config: { url: res.url, method: 'GET' }
        };
        throw (0, error_handling_1.handleAPIError)(error);
    }
}
async function apiRequest(method, url, data) {
    try {
        const res = await fetch(url, {
            method,
            headers: data ? { "Content-Type": "application/json" } : {},
            body: data ? JSON.stringify(data) : undefined,
            credentials: "include",
        });
        await throwIfResNotOk(res);
        return res;
    }
    catch (error) {
        // If it's already an AppError, re-throw it
        if (error.code) {
            throw error;
        }
        // Handle network and other errors
        throw (0, error_handling_1.handleAPIError)(error);
    }
}
const getQueryFn = ({ on401: unauthorizedBehavior }) => async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/"), {
        credentials: "include",
    });
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
    }
    await throwIfResNotOk(res);
    return await res.json();
};
exports.getQueryFn = getQueryFn;
exports.queryClient = new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            queryFn: (0, exports.getQueryFn)({ on401: "throw" }),
            refetchInterval: false,
            refetchOnWindowFocus: false,
            staleTime: Infinity,
            retry: false,
        },
        mutations: {
            retry: false,
        },
    },
});
