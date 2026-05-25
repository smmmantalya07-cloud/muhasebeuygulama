import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  
  // Use a generic window dispatch to notify UI since we can't import toast reliably without context
  const event = new CustomEvent('firestore-error', { detail: errInfo.error });
  window.dispatchEvent(event);
  
  throw new Error(JSON.stringify(errInfo));
}

export const signInGuest = async () => {
    try {
        await signInAnonymously(auth);
    } catch (error: any) {
        // If anonymous auth is restricted/disabled, we gracefully fail
        // admin-restricted-operation usually means it is not enabled in Firebase console
        if (error?.code !== 'auth/admin-restricted-operation') {
            console.error("Firebase Auth Error", error);
        }
    }
};

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch(error) {
     console.error("Firebase Auth Error", error);
  }
}

export const signOutGuest = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Firebase Sign Out Error", error);
    }
};
