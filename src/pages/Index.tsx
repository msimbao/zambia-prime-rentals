import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { Property } from "@/types/property";
import PropertyCard from "@/components/PropertyCard";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const snapshot = await firestore().collection("properties").get();
        const propertyList: Property[] = [];
        const now = new Date();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          
          // Check premium status from denormalized data
          // If ownerIsPremium is undefined (old properties), include them for backward compatibility
          const isPremiumActive = data.ownerIsPremium === undefined || 
            (data.ownerIsPremium && 
             data.ownerPremiumExpiry && 
             data.ownerPremiumExpiry.toDate() > now);

          if (isPremiumActive) {
            propertyList.push({
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate(),
              updatedAt: data.updatedAt?.toDate(),
              ownerPremiumExpiry: data.ownerPremiumExpiry?.toDate(),
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
  }, [searchTerm, statusFilter, typeFilter, properties]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Your Dream Property in Zambia
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
            Browse thousands of properties for sale and rent
          </p>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-5 w-5" />
                  <Input
                    placeholder="Search by name, location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[180px] bg-white/20 border-white/30 text-white">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="furnished_apartment">Furnished Apartment</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold flex items-center">
            <Building2 className="mr-2 h-8 w-8 text-primary" />
            Available Properties
          </h2>
          <p className="text-muted-foreground">
            {filteredProperties.length} properties found
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-64 rounded-lg mb-4"></div>
                <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                <div className="bg-muted h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
