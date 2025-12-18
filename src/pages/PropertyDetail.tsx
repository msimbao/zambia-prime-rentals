import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "@/lib/firebase";
import { Property, User } from "@/types/property";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Maximize2, Phone, User as UserIcon, Mail, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;

      try {
        const doc = await firestore().collection("properties").doc(id).get();
        if (doc.exists) {
          const data = doc.data();
          const propertyData = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
            updatedAt: data.updatedAt?.toDate(),
          } as Property;
          setProperty(propertyData);

          // Fetch owner data
          if (data.ownerId) {
            const ownerDoc = await firestore().collection("users").doc(data.ownerId).get();
            if (ownerDoc.exists) {
              const ownerData = ownerDoc.data();
              setOwner({
                id: ownerDoc.id,
                email: ownerData.email,
                displayEmail: ownerData.displayEmail,
                displayName: ownerData.displayName,
                photoURL: ownerData.photoURL,
                phone: ownerData.phone,
                phone2: ownerData.phone2,
                whatsapp: ownerData.whatsapp,
                aboutMe: ownerData.aboutMe,
                createdAt: ownerData.createdAt?.toDate(),
              } as User);
            }
          }
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

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "ZMW",
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

  const handleWhatsAppClick = () => {
    const phone = owner?.whatsapp || owner?.phone;
    if (phone) {
      const cleanPhone = phone.replace(/\D/g, '');
      const message = encodeURIComponent(`Hi, I'm interested in the property: ${property.name} at ${property.location}`);
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
    }
  };

  const handleCallClick = () => {
    const phone = owner?.phone || owner?.whatsapp;
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Carousel */}
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
              
              <CarouselPrevious className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border-0 w-12 h-12 md:w-14 md:h-14 backdrop-blur-sm opacity-100">
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </CarouselPrevious>
              <CarouselNext className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-white/95 hover:bg-white shadow-lg border-0 w-12 h-12 md:w-14 md:h-14 backdrop-blur-sm opacity-100">
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </CarouselNext>
            </Carousel>
            
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
              {property.images.length} Photos {property.videos && property.videos.length > 0 && `• ${property.videos.length} Videos`}
            </div>
          </div>

          {/* Videos Section */}
          {property.videos && property.videos.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-4">Property Videos</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {property.videos.map((video, index) => (
                  <div key={index} className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <video
                      src={video}
                      controls
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                          {formatPrice(property.price, property.currency)}
                        </p>
                        {property.status === "for_rent" && (
                          <span className="text-sm text-gray-500 ml-1 font-medium">/{formatType(property.pricePeriod || "month")}</span>
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
            </div>

            {/* Contact Card - Sticky on Desktop */}
            <div>
              <Card className="sticky top-4 border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6 md:p-8 space-y-6">
                  {/* Owner Profile Section */}
                  <div className="text-center pb-4 border-b-2 border-gray-100">
                    <Avatar className="h-20 w-20 mx-auto mb-3">
                      <AvatarImage src={owner?.photoURL} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {owner?.displayName?.charAt(0) || property.ownerName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">
                      {owner?.displayName || property.ownerName || "Property Owner"}
                    </h2>
                    <p className="text-gray-600 text-sm">Property Listed by</p>
                  </div>

                  {/* About Me */}
                  {owner?.aboutMe && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">About</p>
                      <p className="text-gray-800 text-sm">{owner.aboutMe}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {/* Phone */}
                    {owner?.phone && (
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone</p>
                          <a href={`tel:${owner.phone}`} className="font-semibold text-primary hover:underline">
                            {owner.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Phone 2 */}
                    {owner?.phone2 && (
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Phone 2</p>
                          <a href={`tel:${owner.phone2}`} className="font-semibold text-primary hover:underline">
                            {owner.phone2}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp */}
                    {owner?.whatsapp && (
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                          <span className="font-semibold text-gray-900">{owner.whatsapp}</span>
                        </div>
                      </div>
                    )}

                    {/* Email - show displayEmail if available, otherwise show signup email */}
                    {(owner?.displayEmail || owner?.email) && (
                      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Email</p>
                          <a href={`mailto:${owner.displayEmail || owner.email}`} className="font-semibold text-primary hover:underline text-sm">
                            {owner.displayEmail || owner.email}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3 pt-4">
                    {(owner?.whatsapp || owner?.phone) && (
                      <Button 
                        className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-green-600 hover:bg-green-700"
                        size="lg"
                        onClick={handleWhatsAppClick}
                      >
                        <MessageCircle className="mr-2 h-5 w-5" />
                        WhatsApp
                      </Button>
                    )}
                    {owner?.phone && (
                      <Button 
                        variant="outline"
                        className="w-full h-14 text-lg font-semibold border-2 hover:bg-gray-50"
                        size="lg"
                        onClick={handleCallClick}
                      >
                        <Phone className="mr-2 h-5 w-5" />
                        Call Now
                      </Button>
                    )}
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