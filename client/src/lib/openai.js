"use strict";
// This file contains OpenAI integration utilities for the frontend
// Actual API calls should go through the backend for security
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateContent = generateContent;
exports.sendChatMessage = sendChatMessage;
async function generateContent(request) {
    const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    if (!response.ok) {
        throw new Error('Failed to generate content');
    }
    return response.json();
}
async function sendChatMessage(message, userId = 'user-1') {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, userId }),
    });
    if (!response.ok) {
        throw new Error('Failed to send chat message');
    }
    return response.json();
}
