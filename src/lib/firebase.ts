import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = !getApps().length ? initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
}) : getApps()[0];

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);

// Auto sign-in anonymously so rules requiring isSignedIn() work smoothly
signInAnonymously(auth).catch((err) => {
  if (err.code === 'auth/admin-restricted-operation' || err.code === 'auth/operation-not-allowed') {
    console.log("Anonymous Auth is not enabled in Firebase Console. Using local fallback rules.");
  } else {
    console.error("Anonymous sign-in error:", err);
  }
});
