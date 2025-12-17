"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  deleteUser
} from 'firebase/auth';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Sign up function with email verification
  const signup = async (email: string, password: string, name: string) => {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with name
      await updateProfile(user, { displayName: name });

      //Send verifiaction email with custom action URL
      const actionCodeSettings = {
        url: `${window.location.origin}/dashboard`, // Redirect URL after verification
        handleCodeInApp: false,
      };
      await sendEmailVerification(user, actionCodeSettings);

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        createdAt: new Date().toISOString(),
        emailVerified: false
      });

      toast.success('Account created! Please check your email to verify your account.');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Signup error:', error);

      // Handle specific error messages
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password should be at least 6 characters');
      } else {
        toast.error('Failed to create account');
      }
      throw error;
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        toast.error("Please verify your email before logging in. Check your inbox!", {
          duration:5000
        });
        //Still allow login but show warning
      } else {
      toast.success('Logged in successfully!');
      }

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/too-many-requests') {
        toast.error('Too many failed attempts. Try again later.');
      } else {
        toast.error('Failed to log in');
      }
      throw error;
    }
  };
   
  // Resend verification email
  const resendVerificationEmail = async () => {
    try {
      if (!user) {
        toast.error('No user logged in');
        return;
      }

      if (user.emailVerified) {
        toast.success('Your email is already verified!');
        return;
      }

      await sendEmailVerification(user);
      toast.success('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Resend verification error:', error);
      
      if (error.code === 'auth/too-many-requests') {
        toast.error('Too many requests. Please wait a few minutes before trying again.');
      } else {
        toast.error('Failed to send verification email');
      }
      throw error;
    }
  };

  // Delete account function
  const deleteAccount = async () => {
    try {
      if (!user) {
        toast.error('No user logged in');
        return;
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', user.uid));

      // Delete Firebase Auth user
      await deleteUser(user);

      toast.success('Account deleted successfully');
      router.push('/');
    } catch (error: any) {
      console.error('Delete account error:', error);
      
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please log out and log back in before deleting your account for security reasons.');
      } else {
        toast.error('Failed to delete account. Please try again.');
      }
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    resendVerificationEmail,
    deleteAccount,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}