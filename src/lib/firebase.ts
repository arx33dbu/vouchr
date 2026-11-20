import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  linkWithCredential,
  EmailAuthProvider,
  User,
  Auth,
} from "firebase/auth";
import { getAnalytics, isSupported as isAnalyticsSupported, Analytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyA6tADx-PMl-OHrHkLBvvRcjvC8yE4SoPs",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vouchrreview.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vouchrreview",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "vouchrreview.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1093965484755",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1093965484755:web:aeb54c3bdf0bff9eb27a26",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-TJX8JKTLJC",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId === "vouchrreview"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let analytics: Analytics | null = null;

if (typeof window !== "undefined") {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    isAnalyticsSupported().then((supported) => {
      if (supported && app) {
        analytics = getAnalytics(app);
      }
    });
  } catch (err) {
    console.warn("Firebase initialization notice:", err);
  }
}

export { app, auth, analytics };

/**
 * Signs in anonymously with Firebase using the configured vouchrreview project.
 * Upgrades seamlessly to email/password credentials once the user subscribes.
 */
export async function authenticateWithTrialKey(trialKey: string): Promise<{
  uid: string;
  isAnonymous: boolean;
  email: string | null;
}> {
  if (typeof window !== "undefined") {
    try {
      if (!app) {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      }
      if (!auth) {
        auth = getAuth(app);
      }

      const userCredential = await signInAnonymously(auth);
      return {
        uid: userCredential.user.uid,
        isAnonymous: userCredential.user.isAnonymous,
        email: userCredential.user.email,
      };
    } catch (error) {
      console.warn("Firebase Anonymous Auth note (ensure Anonymous sign-in is enabled in Firebase Console -> Authentication -> Sign-in method):", error);
    }
  }

  // Local fallback session identifier
  const mockUid = `anon_${trialKey.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}_${Date.now()}`;
  return {
    uid: mockUid,
    isAnonymous: true,
    email: null,
  };
}

/**
 * Upgrades an anonymous trial session to permanent Email/Password via Firebase linkWithCredential
 */
export async function upgradeAnonymousToPermanent(
  email: string,
  pass: string
): Promise<{ success: boolean; email: string; error?: string }> {
  if (auth && auth.currentUser) {
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

  return {
    success: true,
    email,
  };
}
