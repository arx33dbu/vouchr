import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  User,
  Auth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== "undefined" && isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.warn("Firebase initialization warning:", err);
  }
}

export { app, auth };

/**
 * Signs in anonymously with Firebase if configured,
 * otherwise returns a mock anonymous user object.
 */
export async function authenticateWithTrialKey(trialKey: string): Promise<{
  uid: string;
  isAnonymous: boolean;
  email: string | null;
}> {
  if (auth && isFirebaseConfigured) {
    try {
      const userCredential = await signInAnonymously(auth);
      return {
        uid: userCredential.user.uid,
        isAnonymous: userCredential.user.isAnonymous,
        email: userCredential.user.email,
      };
    } catch (error) {
      console.warn("Firebase Anonymous Auth failed, falling back to local trial session:", error);
    }
  }

  // Graceful local trial fallback
  const mockUid = `anon_${trialKey.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}_${Date.now()}`;
  return {
    uid: mockUid,
    isAnonymous: true,
    email: null,
  };
}

/**
 * Upgrades an anonymous user to permanent Email/Password via linkWithCredential
 */
export async function upgradeAnonymousToPermanent(
  email: string,
  pass: string
): Promise<{ success: boolean; email: string; error?: string }> {
  if (auth && auth.currentUser && isFirebaseConfigured) {
    try {
      const credential = EmailAuthProvider.credential(email, pass);
      const result = await linkWithCredential(auth.currentUser, credential);
      return {
        success: true,
        email: result.user.email || email,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to link credential";
      return {
        success: false,
        email,
        error: message,
      };
    }
  }

  // Graceful simulated link
  return {
    success: true,
    email,
  };
}
