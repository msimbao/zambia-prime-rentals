import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { firestore } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

import { PREMIUM_TIERS } from "@/config/premiumTiers";
import LencoPaymentButton from '../components/LencoPaymentButton';

import { ChevronLeft, Crown, Rocket, BarChart3, Zap, Target, Check } from 'lucide-react';

export default function Premium() {
      const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
  const { currentUser, userData, isPremium, refreshPremiumStatus } = useAuth();
  const [premiumDays, setPremiumDays] = useState(30);

  const plans = [
    {
      id: 'silver',
      duration: 'Silver',
      title:'Get Silver',
      color:'#333',
      price: PREMIUM_TIERS.silver.price,
      period: 'month',
      months: 1,
      popular: false,
      features: PREMIUM_TIERS.silver.features
    },
    {
      id: 'gold',
      duration: 'Gold',
      title:'Get Gold!',
      color:'#EAB308',
      price: PREMIUM_TIERS.gold.price,
      period: 'month',
      months: 6,
      popular: false,
      features: PREMIUM_TIERS.gold.features
    },
    {
      id: 'platinum',
      duration: 'Platinum',
      title: 'Get Platinum!',
      color:'#3B82F6',
      price: PREMIUM_TIERS.platinum.price,
      period: 'month',
      months: 12,
      popular: true,
      features: PREMIUM_TIERS.platinum.features
    }
  ];

  const calculateNewPremiumDate = (months: number) => {
    const now = new Date();
    const currentPremiumDate = userData?.premiumExpiryDate ? new Date(userData.premiumExpiryDate) : now;
    
    const startDate = currentPremiumDate > now ? currentPremiumDate : now;
    
    const newDate = new Date(startDate);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
  };

  const handlePurchase = async (plan: any) => {
    if (!currentUser) {
      toast.error('Please log in to purchase premium');
      return;
    }

    setIsProcessing(true);
    setSelectedPlan(plan.id);

    try {
      const newPremiumDate = calculateNewPremiumDate(plan.months);
      
      // Update user document in Firestore
      await firestore().collection('users').doc(currentUser.uid).update({
        isPremium: true,
        premiumTier: plan.id,
        premiumExpiryDate: newPremiumDate,
        lastPremiumPurchase: new Date(),
      });

      await refreshPremiumStatus();

      toast.success(`Success! You're now ${plan.duration} premium until ${newPremiumDate.toLocaleDateString()}`);
      
      navigate('/');
    } catch (error) {
      console.error('Error purchasing premium:', error);
      toast.error('Failed to process premium purchase. Please try again.');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

//         const handleClick = (amount) => {
//     initializePayment({
//       publicKey: "your-public-key",
//       email: "customer@example.com",
//       amount: amount,
//       currency: "ZMW",
//       onSuccess: (response) => {
//         console.log('Payment successful:', response);
//       },
//       onClose: () => {
//         console.log('Payment closed');
//       }
//     });
//   };

    const handleActivatePremium = async () => {
      if (!currentUser) return;
  
      setIsLoading(true);
      try {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + premiumDays);
  
        await firestore().collection("users").doc(currentUser.uid).update({
          isPremium: true,
          premiumExpiryDate: expiryDate,
        });
  
        await refreshPremiumStatus();
        toast.success(`Premium activated for ${premiumDays} days!`);
      } catch (error) {
        console.error("Error activating premium:", error);
        toast.error("Failed to activate premium");
      } finally {
        setIsLoading(false);
        navigate(-1);
      }
    };

  const PricingCard = ({ plan }) => {
    const isSelected = selectedPlan === plan.id;
    const isLoading = isProcessing && isSelected;

    return (
      <div className={`relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl ${
        // plan.popular ? 'border-2 border-blue-500 lg:scale-105' : 'border-2 border-gray-200'
        plan.duration === "Platinum" ? 'border-4 border-blue-500 ' : plan.duration == "Gold" ? 'border-4 border-yellow-200 lg:scale-105' : 'border-4 border-gray-200 lg:scale-105'
      }`}>
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 px-4 py-1.5 rounded-full shadow-lg">
            <span className="text-white font-bold text-xs tracking-wide">⭐ MOST POPULAR</span>
          </div>
        )}
        
        <div className="mb-6">
          {/* <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{plan.duration}</h3> */}
          {plan.savings && (
            <div className="inline-block bg-green-100 px-3 py-1.5 rounded-lg">
              <span className="text-green-700 font-bold text-xs">{plan.savings}</span>
            </div>
          )}
        </div>

        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-baseline mb-2">
            <span className="text-xl font-bold text-blue-500 mr-2">ZMW</span>
            <span className="text-5xl font-black text-gray-900">{plan.price.toLocaleString()}</span>
          </div>
          <p className="text-gray-600 font-semibold">per {plan.period}</p>
        </div>

        <div className="mb-8 space-y-4">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-center">
              <span className="text-green-500 font-bold text-xl mr-3">✓</span>
              <span className="text-gray-700 font-semibold">{feature}</span>
            </div>
          ))}
        </div>
{/* 
        <button
          onClick={() => handlePurchase(plan)}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            plan.duration === "Platinum"
              ? 'bg-blue-500 hover:bg-blue-600' 
              : plan.duration === "Gold" ?
              'bg-yellow-500 hover:bg-yellow-600' :
              'bg-gray-800 hover:bg-gray-900'

          } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'}`}
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <>
              <span>Get Membership</span>
              <span className="text-xl">→</span>
            </>
          )}
        </button> */}
        <LencoPaymentButton
          publicKey="pk_live_3ca99b10-4e01-11ef-803e-8f5c7f6d94a0"
          reference={`${plan.id}-${currentUser?.uid}-${Date.now()}`}
          email={currentUser?.email || 'user@example.com'}
          amount={plan.price}
          title={plan.title}
          backgroundColor={plan.color}
          onSuccess={async (res: any) => {
            await handlePurchase(plan);
          }}
        />
      </div>
    );
  };

  const benefits = [
    { icon: <Rocket className="w-10 h-10" />, title: 'Featured Listings', description: 'Get your properties shown first' },
    // { icon: <BarChart3 className="w-10 h-10" />, title: 'Advanced Analytics', description: 'Track views and engagement' },
    { icon: <Zap className="w-10 h-10" />, title: 'Priority Support', description: '24/7 dedicated assistance' },
    { icon: <Target className="w-10 h-10" />, title: 'Better Visibility', description: 'Reach more potential clients' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <Link
            to="/profile"
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-xl border border-white/20 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="font-semibold text-sm">Back</span>
            </Link>
            
            
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="text-center py-16 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-6xl mb-5">👑</div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Get a Membership
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Unlock powerful features to showcase your properties and reach more potential clients
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Dev Premium */}
        {/* <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-6">
          <h3 className="text-xl font-extrabold text-amber-900 mb-2">🛠️ Development Testing</h3>
          <p className="text-sm text-amber-800 font-medium mb-4">
            Activate 24-hour premium access for testing purposes
          </p>
          <button
            onClick={handleActivatePremium}
            disabled={isProcessing}
            className={`w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl transition-all ${
              isProcessing && selectedPlan === 'dev' ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
            }`}
          >
            {isProcessing && selectedPlan === 'dev' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              </div>
            ) : (
              'Activate Dev Premium (1 Day)'
            )}
          </button>
        </div> */}
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <h3 className="text-3xl font-black text-gray-900 text-center mb-10">
          Why Get a Membership?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
            >
              <div className="text-blue-500 flex justify-center mb-3">
                {benefit.icon}
              </div>
              <h4 className="text-lg font-extrabold text-gray-900 mb-2">
                {benefit.title}
              </h4>
              <p className="text-sm text-gray-600 font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}