/**
 * Firebase Authentication Module
 */

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const ADMIN_EMAIL = 'nayeemalizayn@gmail.com';
export const ADMIN_EMAILS = ['nayeemalizayn@gmail.com', 'mskhereiam5610@gmail.com'];

export interface StandaloneUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phoneNumber?: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  tenantId?: string | null;
  providerData?: Array<{
    providerId: string;
    email?: string | null;
  }>;
}

export type User = FirebaseUser | StandaloneUser;

export { auth };

/**
 * Checks if the given email is an authorized administrator.
 * Grants admin power to 'nayeemalizayn@gmail.com' and fallback 'mskhereiam5610@gmail.com'.
 */
export const isAuthorizedAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const clean = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === clean);
};

export const onAuthStateChanged = (
  _authInstance: typeof auth,
  callback: (user: User | null) => void
): (() => void) => {
  return firebaseOnAuthStateChanged(auth, (user) => {
    callback(user);
  });
};

export const loginWithGoogle = async (_preferAdmin: boolean = false) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user };
  } catch (error: any) {
    console.error('Firebase Google Sign-In Error:', error);
    throw error;
  }
};

export const loginWithEmailPassword = async (email: string, pass: string = 'password123') => {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
    return { user: result.user };
  } catch (error: any) {
    // If user not found, attempt auto-registration for convenience
    if (error?.code === 'auth/user-not-found' || error?.code === 'auth/invalid-credential') {
      try {
        const createResult = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
        return { user: createResult.user };
      } catch (createErr) {
        throw error;
      }
    }
    throw error;
  }
};

export const registerWithEmailPassword = async (
  email: string,
  pass: string,
  displayName?: string
) => {
  const result = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }
  return { user: result.user };
};

export const logoutFirebase = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
  }
};

export const logoutAuth = logoutFirebase;
