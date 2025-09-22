'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.trackEvent =
  exports.FirestoreService =
  exports.AuthService =
  exports.analytics =
  exports.db =
  exports.auth =
    void 0;
const app_1 = require('firebase/app');
const analytics_1 = require('firebase/analytics');
const auth_1 = require('firebase/auth');
const firestore_1 = require('firebase/firestore');
// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE',
  authDomain: 'aios-97581.firebaseapp.com',
  projectId: 'aios-97581',
  storageBucket: 'aios-97581.appspot.com',
  messagingSenderId: '307575156824',
  appId: '1:307575156824:web:00924bd384df1f29909a2d',
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.auth = (0, auth_1.getAuth)(app);
exports.db = (0, firestore_1.getFirestore)(app);
exports.analytics = (0, analytics_1.getAnalytics)(app);
// Google Auth Provider
const googleProvider = new auth_1.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');
class AuthService {
  static async signInWithGoogle() {
    try {
      const result = await (0, auth_1.signInWithPopup)(
        exports.auth,
        googleProvider
      );
      const user = result.user;
      // Save user data to Firestore
      await this.saveUserToFirestore(user);
      return user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }
  static async signOut() {
    try {
      await (0, auth_1.signOut)(exports.auth);
    } catch (error) {
      console.error('Sign-out error:', error);
      throw error;
    }
  }
  static onAuthStateChanged(callback) {
    return (0, auth_1.onAuthStateChanged)(exports.auth, callback);
  }
  static async saveUserToFirestore(user) {
    try {
      const userRef = (0, firestore_1.doc)(exports.db, 'users', user.uid);
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
      await (0, firestore_1.setDoc)(userRef, userData, { merge: true });
    } catch (error) {
      console.error('Error saving user to Firestore:', error);
      throw error;
    }
  }
  static async getUserData(uid) {
    try {
      const userRef = (0, firestore_1.doc)(exports.db, 'users', uid);
      const userSnap = await (0, firestore_1.getDoc)(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      throw error;
    }
  }
  static async updateUserData(uid, data) {
    try {
      const userRef = (0, firestore_1.doc)(exports.db, 'users', uid);
      await (0, firestore_1.updateDoc)(userRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }
}
exports.AuthService = AuthService;
class FirestoreService {
  // Posts
  static async createPost(userId, postData) {
    try {
      const docRef = await (0, firestore_1.addDoc)(
        (0, firestore_1.collection)(exports.db, 'posts'),
        {
          ...postData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }
  static async getPosts(userId, limitCount = 10) {
    try {
      let q = (0, firestore_1.query)(
        (0, firestore_1.collection)(exports.db, 'posts'),
        (0, firestore_1.orderBy)('createdAt', 'desc'),
        (0, firestore_1.limit)(limitCount)
      );
      if (userId) {
        q = (0, firestore_1.query)(
          (0, firestore_1.collection)(exports.db, 'posts'),
          (0, firestore_1.where)('userId', '==', userId),
          (0, firestore_1.orderBy)('createdAt', 'desc'),
          (0, firestore_1.limit)(limitCount)
        );
      }
      const querySnapshot = await (0, firestore_1.getDocs)(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }
  static async updatePost(postId, data) {
    try {
      const postRef = (0, firestore_1.doc)(exports.db, 'posts', postId);
      await (0, firestore_1.updateDoc)(postRef, {
        ...data,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }
  static async deletePost(postId) {
    try {
      const postRef = (0, firestore_1.doc)(exports.db, 'posts', postId);
      await (0, firestore_1.deleteDoc)(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
  // Workflows
  static async createWorkflow(userId, workflowData) {
    try {
      const docRef = await (0, firestore_1.addDoc)(
        (0, firestore_1.collection)(exports.db, 'workflows'),
        {
          ...workflowData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating workflow:', error);
      throw error;
    }
  }
  static async getWorkflows(userId) {
    try {
      const q = (0, firestore_1.query)(
        (0, firestore_1.collection)(exports.db, 'workflows'),
        (0, firestore_1.where)('userId', '==', userId),
        (0, firestore_1.orderBy)('createdAt', 'desc')
      );
      const querySnapshot = await (0, firestore_1.getDocs)(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting workflows:', error);
      throw error;
    }
  }
  // AI Agents
  static async createAgent(userId, agentData) {
    try {
      const docRef = await (0, firestore_1.addDoc)(
        (0, firestore_1.collection)(exports.db, 'agents'),
        {
          ...agentData,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }
  static async getAgents(userId) {
    try {
      const q = (0, firestore_1.query)(
        (0, firestore_1.collection)(exports.db, 'agents'),
        (0, firestore_1.where)('userId', '==', userId),
        (0, firestore_1.orderBy)('createdAt', 'desc')
      );
      const querySnapshot = await (0, firestore_1.getDocs)(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting agents:', error);
      throw error;
    }
  }
  // Chat Messages
  static async createChatMessage(userId, messageData) {
    try {
      const docRef = await (0, firestore_1.addDoc)(
        (0, firestore_1.collection)(exports.db, 'chatMessages'),
        {
          ...messageData,
          userId,
          createdAt: new Date(),
        }
      );
      return docRef.id;
    } catch (error) {
      console.error('Error creating chat message:', error);
      throw error;
    }
  }
  static async getChatMessages(userId, limitCount = 50) {
    try {
      const q = (0, firestore_1.query)(
        (0, firestore_1.collection)(exports.db, 'chatMessages'),
        (0, firestore_1.where)('userId', '==', userId),
        (0, firestore_1.orderBy)('createdAt', 'desc'),
        (0, firestore_1.limit)(limitCount)
      );
      const querySnapshot = await (0, firestore_1.getDocs)(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw error;
    }
  }
}
exports.FirestoreService = FirestoreService;
const trackEvent = (eventName, eventParams) => {
  (0, analytics_1.logEvent)(exports.analytics, eventName, eventParams);
};
exports.trackEvent = trackEvent;
exports.default = app;
