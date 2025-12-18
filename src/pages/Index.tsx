import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// High-quality background images for hero section
const HERO_BACKGROUNDS = [
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80", // Modern house exterior
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80", // Luxury home facade
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80", // Contemporary house
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&q=80", // Modern architecture
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1920&q=80", // Beautiful property
  "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=1920&q=80", // Elegant home
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80", // Stunning property
];

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [displayedProperties, setDisplayedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [heroBackground, setHeroBackground] = useState("");
  const PROPERTIES_PER_PAGE = 12;

  // Select random background on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_BACKGROUNDS.length);
    setHeroBackground(HERO_BACKGROUNDS[randomIndex]);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await firestore().collection("properties").get();
        const propertyList: Property[] = [];
        const now = new Date();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          
          // Check if listing is still active (not expired)
          const isListingActive = data.listingExpiryDate && 
            data.listingExpiryDate.toDate() > now;

          // Check if property is visible (default to true for backwards compatibility)
          const isVisible = data.isVisible !== false;

          if (isListingActive && isVisible) {
            propertyList.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              listingExpiryDate: data.listingExpiryDate?.toDate(),
            } as Property);
          }
        });

        setProperties(propertyList);
        setFilteredProperties(propertyList);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    setFilteredProperties(filtered);
    setPage(1);
  }, [searchTerm, statusFilter, typeFilter, properties]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = page * PROPERTIES_PER_PAGE;
    setDisplayedProperties(filteredProperties.slice(startIndex, endIndex));
  }, [filteredProperties, page]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const hasMore = displayedProperties.length < filteredProperties.length;

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
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/60 to-black/70"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
              <MapPin className="h-4 w-4" />
              <span className="text-sm font-medium">Zambia's #1 Property Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Dream Stay
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mt-2">
                in Zambia
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Discover thousands of premium properties for rent
            </p>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/95 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                      placeholder="Search by name, location, or keyword..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 rounded-xl focus:ring-2 focus:ring-primary shadow-sm"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[200px] h-14 bg-white border-gray-200 text-gray-900 rounded-xl shadow-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="for_sale">For Sale</SelectItem>
                      <SelectItem value="for_rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[200px] h-14 bg-white border-gray-200 text-gray-900 rounded-xl shadow-sm">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="furnished_apartment">Furnished Apartment</SelectItem>
                      <SelectItem value="office_space">Office Space</SelectItem>
                      <SelectItem value="boarding_house">Boarding House</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 115" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 130L0 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="rgb(249 250 251)" fillOpacity="1"/>
          </svg>
        </div>
      </section>

      {/* Properties Section */}
      <section className="container mx-auto px-4 py-16 -mt-2">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-bold flex items-center mb-2">
              <Building2 className="mr-3 h-9 w-9 text-primary" />
              Available Properties
            </h2>
            <p className="text-gray-600 text-lg ml-12">
              Explore our curated collection of premium listings
            </p>
          </div>
          <div className="bg-white px-6 py-3 rounded-full shadow-md border border-gray-200">
            <p className="text-gray-700 font-semibold">
              <span className="text-primary text-2xl font-bold">{filteredProperties.length}</span>
              <span className="text-gray-500 ml-2">properties found</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gray-200 h-64"></div>
                <div className="p-6">
                  <div className="bg-gray-200 h-6 rounded w-3/4 mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded w-1/2 mb-3"></div>
                  <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 text-lg">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-16">
                <Button 
                  onClick={handleLoadMore} 
                  size="lg"
                  className="px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Load More Properties
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Index;