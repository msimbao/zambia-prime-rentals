import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, firestore, checkPremiumStatus } from "@/lib/firebase";
import { User } from "@/types/property";

interface AuthContextType {
  currentUser: any;
  userData: User | null;
  isPremium: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
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
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshPremiumStatus = async () => {
    if (currentUser) {
      const premium = await checkPremiumStatus(currentUser.uid);
      setIsPremium(premium);
    }
  };

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
            isPremium: data.isPremium || false,
            premiumExpiryDate: data.premiumExpiryDate?.toDate(),
            createdAt: data.createdAt?.toDate(),
          } as User);
          
          const premium = await checkPremiumStatus(user.uid);
          setIsPremium(premium);
        }
      } else {
        setUserData(null);
        setIsPremium(false);
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
        isPremium: false,
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
    isPremium,
    loading,
    login,
    signup,
    logout,
    refreshPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
