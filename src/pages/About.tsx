import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Target, Users, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            About ZamProperty
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto">
            Your trusted partner in finding the perfect property in Zambia
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="animate-fade-in">
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    At ZamProperty, we're dedicated to revolutionizing the real estate market in Zambia. 
                    Our platform connects property seekers with verified listings, making it easier than 
                    ever to find your dream home, investment property, or rental space. We believe in 
                    transparency, efficiency, and providing exceptional service to both property owners 
                    and seekers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Listings</h3>
                <p className="text-muted-foreground">
                  All properties are verified by premium members, ensuring quality and authenticity.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Easy Connection</h3>
                <p className="text-muted-foreground">
                  Connect directly with property owners through our streamlined contact system.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-scale">
              <CardContent className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Service</h3>
                <p className="text-muted-foreground">
                  Premium members get advanced features and priority support for their listings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Founded with a vision to simplify property search in Zambia, ZamProperty has grown 
              to become a trusted platform for thousands of users across the country. We understand 
              the challenges of finding the right property, whether you're looking to buy, rent, or 
              invest.
            </p>
            <p>
              Our team is passionate about real estate and technology, combining both to create 
              an intuitive platform that serves the needs of modern property seekers and owners. 
              We continuously innovate and improve our services based on user feedback and market trends.
            </p>
            <p>
              Join us on our journey to make property transactions in Zambia seamless, transparent, 
              and accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 ZamProperty. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
