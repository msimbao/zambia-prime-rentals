import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { PREMIUM_TIERS } from "@/config/premiumTiers";
import { ChevronLeft, Crown, Rocket, Zap, Target, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Premium() {
  const navigate = useNavigate();

  const plans = [
    {
      id: 'silver',
      name: 'Silver',
      color: 'border-gray-400',
      bgColor: 'bg-gray-100',
      price: PREMIUM_TIERS.silver.price,
      features: PREMIUM_TIERS.silver.features
    },
    {
      id: 'gold',
      name: 'Gold',
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-50',
      price: PREMIUM_TIERS.gold.price,
      features: PREMIUM_TIERS.gold.features,
      popular: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      color: 'border-blue-500',
      bgColor: 'bg-blue-50',
      price: PREMIUM_TIERS.platinum.price,
      features: PREMIUM_TIERS.platinum.features
    }
  ];

  const benefits = [
    { icon: <Rocket className="w-10 h-10" />, title: 'Featured Listings', description: 'Get your properties shown first' },
    { icon: <Zap className="w-10 h-10" />, title: 'Social Promotion', description: 'Properties promoted on social media' },
    { icon: <Target className="w-10 h-10" />, title: 'Better Visibility', description: 'Reach more potential clients' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-5 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
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
          <div className="text-6xl mb-5">🏠</div>
          <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Per-Listing Pricing
          </h2>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            Pay only for what you need. Each property listing has its own tier and duration.
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-300 hover:shadow-2xl border-4 ${plan.color} ${plan.popular ? 'lg:scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 px-4 py-1.5 rounded-full shadow-lg">
                  <span className="text-white font-bold text-xs tracking-wide">⭐ POPULAR</span>
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
                  {plan.name}
                  {plan.id === 'platinum' && <Crown className="h-6 w-6 text-blue-500" />}
                  {plan.id === 'gold' && <Crown className="h-6 w-6 text-yellow-500" />}
                </h3>
              </div>

              <div className="mb-8 pb-8 border-b border-gray-200">
                <div className="flex items-baseline mb-2">
                  <span className="text-xl font-bold text-primary mr-2">ZMW</span>
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                </div>
                <p className="text-gray-600 font-semibold">per listing</p>
              </div>

              <div className="mb-8 space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center">
                    <Check className="text-green-500 font-bold text-xl mr-3 h-5 w-5" />
                    <span className="text-gray-700 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => navigate('/add-property')}
                className="w-full"
                size="lg"
              >
                List a Property
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Ready to list your property? Choose your tier during the listing process.
          </p>
          <Button onClick={() => navigate('/add-property')} size="lg">
            Add New Property
          </Button>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-5 pb-16">
        <h3 className="text-3xl font-black text-gray-900 text-center mb-10">
          Why List With Us?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all"
            >
              <div className="text-primary flex justify-center mb-3">
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
