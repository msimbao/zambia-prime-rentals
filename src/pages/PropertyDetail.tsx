import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "@/lib/firebase";
import { Property } from "@/types/property";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Maximize2, Phone, User, Mail, ChevronLeft, ChevronRight, Navigation } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PropertyMap from "@/components/PropertyMap";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        const doc = await firestore().collection("properties").doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          setProperty({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Property);
        }
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="bg-gray-200 h-96 rounded-2xl"></div>
              <div className="bg-gray-200 h-12 rounded-lg w-3/4"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-gray-200 h-64 rounded-2xl"></div>
                <div className="bg-gray-200 h-64 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Property not found</h1>
            <p className="text-gray-600">The property you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ZMW",
    }).format(price);
  };

  const formatStatus = (status: string) => {
    return status === "for_sale" ? "For Sale" : "For Rent";
  };

  const formatType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Carousel with Always-Visible Controls */}
          <div className="relative mb-8 group">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
                      <img
                        src={image}
                        alt={`${property.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Custom Always-Visible Navigation Buttons */}
              <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border-0 w-12 h-12 md:w-14 md:h-14 backdrop-blur-sm opacity-100">
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </CarouselPrevious>
              <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border-0 w-12 h-12 md:w-14 md:h-14 backdrop-blur-sm opacity-100">
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </CarouselNext>
            </Carousel>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {property.images.length} Photos
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{property.name}</h1>
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <div className="bg-gray-100 p-2 rounded-lg mr-3">
                            <MapPin className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-lg">{property.location}</span>
                        </div>
                        {property.address && (
                          <div className="flex items-center text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-lg mr-3">
                              <Navigation className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-lg">{property.address}</span>
                          </div>
                        )}
                        <div className="flex items-center text-gray-600">
                          <div className="bg-gray-100 p-2 rounded-lg mr-3">
                            <Maximize2 className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-lg">{property.size} {property.sizeUnit}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                     <div className="flex items-baseline mb-3">
  <p className="text-2xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
    {formatPrice(property.price)}
  </p>
  {property.status === "for_rent" && (
    <span className="text-sm text-gray-500 ml-1 font-medium">/month</span>
  )}
</div>
                      <div className="flex gap-2">
                        <Badge 
                          variant={property.status === "for_sale" ? "default" : "secondary"}
                          className="text-xs px-3 py-1"
                        >
                          {formatStatus(property.status)}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-3 py-1 border-2">
                          {formatType(property.type)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description Card */}
              <Card className="border-0 shadow-xl bg-white">
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 flex items-center">
                    <div className="bg-primary/10 p-2 rounded-lg mr-3">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    Property Description
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                      {property.description}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Property Features */}
              <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold mb-4 text-gray-900">Quick Facts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="font-semibold text-gray-900">{formatType(property.type)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Size</p>
                      <p className="font-semibold text-gray-900">{property.size} {property.sizeUnit}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p className="font-semibold text-gray-900">{formatStatus(property.status)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="font-semibold text-gray-900">{property.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location Map */}
              {property.address && (
                <Card className="border-0 shadow-xl bg-white">
                  <CardContent className="p-6 md:p-8">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                      <div className="bg-primary/10 p-2 rounded-lg mr-3">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      Location
                    </h3>
                    <PropertyMap 
                      address={property.address} 
                      location={property.location}
                      propertyName={property.name}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Contact Card - Sticky on Desktop */}
            <div>
              <Card className="sticky top-4 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6 md:p-8 space-y-6">
                  <div className="text-center pb-4 border-b-2 border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Owner</h2>
                    <p className="text-gray-600">Get in touch to schedule a viewing</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Owner</p>
                        <p className="font-semibold text-gray-900 text-lg">{property.ownerName}</p>
                      </div>
                    </div>
                    
                    {property.ownerPhone && (
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <a 
                            href={`tel:${property.ownerPhone}`}
                            className="font-semibold text-primary hover:text-primary/80 transition-colors text-lg"
                          >
                            {property.ownerPhone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <Button 
                      className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      size="lg"
                      onClick={() => window.location.href = `tel:${property.ownerPhone}`}
                    >
                      <Phone className="mr-2 h-5 w-5" />
                      Call Now
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-14 text-lg font-semibold border-2 hover:bg-gray-50"
                      size="lg"
                    >
                      <Mail className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </div>

                  <div className="pt-4 border-t-2 border-gray-100">
                    <p className="text-sm text-gray-600 text-center">
                      Listed {property.createdAt?.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;