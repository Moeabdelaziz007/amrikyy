import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, orderBy, limit, } from 'firebase/firestore';
// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = typeof window !== 'undefined' && firebaseConfig.measurementId
    ? getAnalytics(app)
    : undefined;
// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
export class AuthService {
    static async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            // Save user data to Firestore
            await this.saveUserToFirestore(user);
            return user;
        }
        catch (error) {
            console.error('Google sign-in error:', error);
            throw error;
        }
    }
    static async signOut() {
        try {
            await signOut(auth);
        }
        catch (error) {
            console.error('Sign-out error:', error);
            throw error;
        }
    }
    static onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
    static async signInWithEmail(email, password) {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            // Save user data to Firestore
            await this.saveUserToFirestore(user);
            return user;
        }
        catch (error) {
            console.error('Email sign-in error:', error);
            throw error;
        }
    }
    static async signUpWithEmail(email, password, displayName) {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const user = result.user;
            // Update display name if provided
            if (displayName && user) {
                await updateProfile(user, { displayName });
            }
            // Save user data to Firestore
            await this.saveUserToFirestore(user);
            return user;
        }
        catch (error) {
            console.error('Email sign-up error:', error);
            throw error;
        }
    }
    static async saveUserToFirestore(user) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                emailVerified: user.emailVerified,
                createdAt: new Date(),
                lastLoginAt: new Date(),
                preferences: {
                    theme: 'light',
                    notifications: true,
                    language: 'en',
                },
            };
            await setDoc(userRef, userData, { merge: true });
        }
        catch (error) {
            console.error('Error saving user to Firestore:', error);
            throw error;
        }
    }
    static async getUserData(uid) {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                return userSnap.data();
            }
            else {
                throw new Error('User data not found');
            }
        }
        catch (error) {
            console.error('Error getting user data:', error);
            throw error;
        }
    }
    static async updateUserData(uid, data) {
        try {
            const userRef = doc(db, 'users', uid);
            await updateDoc(userRef, {
                ...data,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    }
}
export class FirestoreService {
    // Posts
    static async createPost(userId, postData) {
        try {
            const docRef = await addDoc(collection(db, 'posts'), {
                ...postData,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }
    static async getPosts(userId, limitCount = 10) {
        try {
            let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(limitCount));
            if (userId) {
                q = query(collection(db, 'posts'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));
            }
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error getting posts:', error);
            throw error;
        }
    }
    static async updatePost(postId, data) {
        try {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                ...data,
                updatedAt: new Date(),
            });
        }
        catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }
    static async deletePost(postId) {
        try {
            const postRef = doc(db, 'posts', postId);
            await deleteDoc(postRef);
        }
        catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    }
    // Workflows
    static async createWorkflow(userId, workflowData) {
        try {
            const docRef = await addDoc(collection(db, 'workflows'), {
                ...workflowData,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating workflow:', error);
            throw error;
        }
    }
    static async getWorkflows(userId) {
        try {
            const q = query(collection(db, 'workflows'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error getting workflows:', error);
            throw error;
        }
    }
    // AI Agents
    static async createAgent(userId, agentData) {
        try {
            const docRef = await addDoc(collection(db, 'agents'), {
                ...agentData,
                userId,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating agent:', error);
            throw error;
        }
    }
    static async getAgents(userId) {
        try {
            const q = query(collection(db, 'agents'), where('userId', '==', userId), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error getting agents:', error);
            throw error;
        }
    }
    // Chat Messages
    static async createChatMessage(userId, messageData) {
        try {
            const docRef = await addDoc(collection(db, 'chatMessages'), {
                ...messageData,
                userId,
                createdAt: new Date(),
            });
            return docRef.id;
        }
        catch (error) {
            console.error('Error creating chat message:', error);
            throw error;
        }
    }
    static async getChatMessages(userId, limitCount = 50) {
        try {
            const q = query(collection(db, 'chatMessages'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(limitCount));
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
        }
        catch (error) {
            console.error('Error getting chat messages:', error);
            throw error;
        }
    }
}
export const trackEvent = (eventName, eventParams) => {
    if (analytics) {
        logEvent(analytics, eventName, eventParams);
    }
};
export default app;
//# sourceMappingURL=firebase.js.map