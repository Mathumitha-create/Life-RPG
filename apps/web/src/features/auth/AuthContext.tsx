import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "./firebase";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  isDev?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  idToken: string | null;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginDevUser: (nickname?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEV_STORAGE_KEY = "liferpg_dev_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check local storage for persistent dev session first
    const savedDevUser = localStorage.getItem(DEV_STORAGE_KEY);
    if (savedDevUser) {
      try {
        const parsed = JSON.parse(savedDevUser) as AuthUser;
        setUser(parsed);
        setIdToken(`dev-token:${parsed.uid}:${parsed.email || "hero@liferpg.local"}`);
        setIsLoading(false);
        return;
      } catch {
        localStorage.removeItem(DEV_STORAGE_KEY);
      }
    }

    // Subscribe to standard Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isDev: false,
        });
        setIdToken(token);
      } else {
        // If not logged in and no dev user, clear
        if (!localStorage.getItem(DEV_STORAGE_KEY)) {
          setUser(null);
          setIdToken(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      setUser({
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        isDev: false,
      });
      setIdToken(token);
      localStorage.removeItem(DEV_STORAGE_KEY);
    } catch (error) {
      console.warn("Google sign-in popup error, switching to quick adventurer mode:", error);
      // Fallback to dev user in offline/dev environments
      loginDevUser("Adventurer");
    } finally {
      setIsLoading(false);
    }
  };

  const loginDevUser = (nickname = "Adventurer") => {
    const devUser: AuthUser = {
      uid: "dev_hero_" + Math.random().toString(36).substring(2, 8),
      email: `${nickname.toLowerCase().replace(/\s+/g, "")}@liferpg.local`,
      displayName: nickname,
      isDev: true,
    };
    localStorage.setItem(DEV_STORAGE_KEY, JSON.stringify(devUser));
    setUser(devUser);
    setIdToken(`dev-token:${devUser.uid}:${devUser.email}`);
    setIsLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem(DEV_STORAGE_KEY);
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setIdToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      idToken,
      isLoading,
      loginWithGoogle,
      loginDevUser,
      logout,
    }),
    [user, idToken, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
