import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Users, Award, Mail, Phone, MapPin } from "lucide-react";

// High-quality background images for hero section
const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80",
  "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1920&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80",
];

const About = () => {
  const [heroBackground, setHeroBackground] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_BACKGROUNDS.length);
    setHeroBackground(HERO_BACKGROUNDS[randomIndex]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-32 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/70 to-black/70"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">About Our Company</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">
                Crystal Flame
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Your trusted partner in finding the perfect property in Zambia
            </p>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="rgb(249 250 251)" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16 -mt-1">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-fade-in shadow-xl border-0 bg-white">
            <CardContent className="p-10">
              <div className="flex items-start space-x-6">
                <div className="bg-gradient-to-br from-primary to-primary/80 p-4 rounded-2xl shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Mission</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    At Crystal Flame, we specialize in helping you find Zambia's most exclusive and elegantly furnished apartments. Whether you're a professional seeking luxury comfort, an expatriate settling into a new home, or someone who appreciates premium living during your stay in Zambia, our platform connects you with verified high-end rental listings that match your lifestyle. We're committed to transparency, convenience, and exceptional service, ensuring your search for the perfect furnished apartment is effortless and rewarding.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We provide exceptional service and connect you with premium properties
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="hover-scale border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Foreign Exposure</h3>
                <p className="text-gray-600 leading-relaxed">
                  We connect various foreign missions with high end Zambian properties.
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Verified Listings</h3>
                <p className="text-gray-600 leading-relaxed">
                  All properties are verified by premium members, ensuring quality and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale border-0 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-900">Premium Service</h3>
                <p className="text-gray-600 leading-relaxed">
                  Experience a premium service designed to connect you with Zambia's most exclusive furnished apartments.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get In Touch</h2>
            <p className="text-gray-600 text-lg">
              Have questions? We're here to help you find your perfect property
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Email Us</h3>
                <a 
                  href="mailto:info@crystalflame.com" 
                  className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                >
                  crystalflamerealestate@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Whatsapp Us</h3>
                <a 
                  href="tel:+260123456789" 
                  className="text-primary hover:text-primary/80 transition-colors text-lg font-medium"
                >
                  +260 971897512
                </a>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Call Us</h3>
                <p className="text-gray-600 text-lg">
                  +260 750105948
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardContent className="p-10">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Founded with a vision to simplify property search in Zambia, Crystal Flame has grown 
                  to become a trusted platform for connecting clients with premium properties. We understand 
                  the importance of finding the right home, and our team is dedicated to providing exceptional 
                  service throughout your property search journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 shadow-inner">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="text-lg">&copy; 2025 Crystal Flame. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;