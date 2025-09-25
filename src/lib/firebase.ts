import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyApDku-geNVplwIgRBz2U0rs46aAVo-_mE',
  authDomain: 'aios-97581.firebaseapp.com',
  projectId: 'aios-97581',
  storageBucket: 'aios-97581.firebasestorage.app',
  messagingSenderId: '307575156824',
  appId: '1:307575156824:web:00924bd384df1f29909a2d',
  measurementId: 'G-JQN1FBR0F4',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
