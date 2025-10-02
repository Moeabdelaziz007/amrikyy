import { IService } from '../types/os';
import { auth, googleProvider } from '../../lib/firebase';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

type AuthListener = (user: User | null) => void;

export class AuthService implements IService {
  public readonly name = 'auth';
  private currentUser: User | null = null;
  private listeners: Set<AuthListener> = new Set();

  start(): void {
    onAuthStateChanged(auth, (user) => {
      this.currentUser = user;
      for (const cb of this.listeners) cb(user);
    });
  }

  getUser(): User | null {
    return this.currentUser;
  }

  onChange(cb: AuthListener): () => void {
    this.listeners.add(cb);
    cb(this.currentUser);
    return () => this.listeners.delete(cb);
  }

  async loginWithGoogle(): Promise<void> {
    await signInWithPopup(auth, googleProvider);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}

export const authService = new AuthService();


