import { User } from 'firebase/auth';
declare const app: import("@firebase/app").FirebaseApp;
export declare const auth: import("firebase/auth").Auth;
export declare const db: import("@firebase/firestore").Firestore;
export declare const analytics: import("@firebase/analytics").Analytics;
export declare class AuthService {
    static signInWithGoogle(): Promise<User>;
    static signOut(): Promise<void>;
    static onAuthStateChanged(callback: (user: User | null) => void): () => void;
    static signInWithEmail(email: string, password: string): Promise<User>;
    static signUpWithEmail(email: string, password: string, displayName?: string): Promise<User>;
    static saveUserToFirestore(user: User): Promise<void>;
    static getUserData(uid: string): Promise<any>;
    static updateUserData(uid: string, data: any): Promise<void>;
}
export declare class FirestoreService {
    static createPost(userId: string, postData: any): Promise<string>;
    static getPosts(userId?: string, limitCount?: number): Promise<any[]>;
    static updatePost(postId: string, data: any): Promise<void>;
    static deletePost(postId: string): Promise<void>;
    static createWorkflow(userId: string, workflowData: any): Promise<string>;
    static getWorkflows(userId: string): Promise<any[]>;
    static createAgent(userId: string, agentData: any): Promise<string>;
    static getAgents(userId: string): Promise<any[]>;
    static createChatMessage(userId: string, messageData: any): Promise<string>;
    static getChatMessages(userId: string, limitCount?: number): Promise<any[]>;
}
export declare const trackEvent: (eventName: string, eventParams?: {
    [key: string]: any;
}) => void;
export default app;
//# sourceMappingURL=firebase.d.ts.map