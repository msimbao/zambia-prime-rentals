// Firebase configuration and initialization
// Replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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
