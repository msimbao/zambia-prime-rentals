import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore } from "@/lib/firebase";
import { User } from "@/types/property";

interface AuthContextType {
  currentUser: any;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user: any) => {
      setCurrentUser(user);
      
      if (user) {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUserData({
            id: user.uid,
            email: user.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            phone: data.phone,
            whatsapp: data.whatsapp,
            aboutMe: data.aboutMe,
            createdAt: data.createdAt?.toDate(),
          } as User);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    
    if (result.user) {
      await firestore().collection('users').doc(result.user.uid).set({
        email,
        displayName,
        createdAt: new Date(),
      });
    }
  };

  const login = async (email: string, password: string) => {
    await auth().signInWithEmailAndPassword(email, password);
  };

  const logout = async () => {
    await auth().signOut();
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
