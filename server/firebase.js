"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = initializeFirebase;
exports.verifyToken = verifyToken;
const firebase_admin_1 = require("firebase-admin");
let isFirebaseInitialized = false;
function initializeFirebase() {
    if (firebase_admin_1.default.apps.length === 0) {
        try {
            console.log('Initializing Firebase...');
            // Attempt to initialize with application default credentials
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.applicationDefault(),
                databaseURL: `https://${process.env.GCLOUD_PROJECT}.firebaseio.com`
            });
            console.log('Firebase initialized successfully.');
            isFirebaseInitialized = true;
        }
        catch (e) {
            console.error('Firebase initialization failed:', e);
            console.log('Could not initialize Firebase Admin SDK. Some features may be disabled.');
        }
    }
    return {
        admin: firebase_admin_1.default,
        isFirebaseInitialized
    };
}
async function verifyToken(token) {
    if (!isFirebaseInitialized) {
        initializeFirebase();
    }
    try {
        const decodedToken = await firebase_admin_1.default.auth().verifyIdToken(token);
        return decodedToken;
    }
    catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid authentication token');
    }
}
