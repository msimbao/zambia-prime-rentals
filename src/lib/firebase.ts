// Firebase configuration and initialization
// Replace these with your actual Firebase config
const firebaseConfig = {

  apiKey: "AIzaSyDM6sd8IIhnTGOVe2b9ZaI208q15UnBfCg",

  authDomain: "lmrentals-e8088.firebaseapp.com",

  databaseURL: "https://lmrentals-e8088-default-rtdb.firebaseio.com",

  projectId: "lmrentals-e8088",

  storageBucket: "lmrentals-e8088.firebasestorage.app",

  messagingSenderId: "777006104069",

  appId: "1:777006104069:web:8030c514167655038f266c",

  measurementId: "G-907MEJ2LW8"

};

// Initialize Firebase
if (typeof window !== 'undefined' && !(window as any).firebase.apps.length) {
  (window as any).firebase.initializeApp(firebaseConfig);
}

export const auth = () => (window as any).firebase.auth();
export const firestore = () => (window as any).firebase.firestore();
export const storage = () => (window as any).firebase.storage();

// Helper to get current user
export const getCurrentUser = () => auth().currentUser;

// Helper to check premium status
export const checkPremiumStatus = async (userId: string) => {
  const userDoc = await firestore().collection('users').doc(userId).get();
  if (!userDoc.exists) return false;
  
  const userData = userDoc.data();
  if (!userData.isPremium) return false;
  
  const expiryDate = userData.premiumExpiryDate?.toDate();
  if (!expiryDate) return false;
  
  return expiryDate > new Date();
};
