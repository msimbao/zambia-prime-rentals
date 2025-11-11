import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "@/lib/firebase";
import { Property } from "@/types/property";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Maximize2, Phone, User } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="bg-muted h-96 rounded-lg"></div>
            <div className="bg-muted h-8 rounded w-1/2"></div>
            <div className="bg-muted h-4 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold">Property not found</h1>
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <Carousel className="w-full mb-8">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${property.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-5 w-5 mr-2" />
                      {property.location}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Maximize2 className="h-5 w-5 mr-2" />
                      {property.size} {property.sizeUnit}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary mb-2">
                      {formatPrice(property.price)}
                    </p>
                    <div className="space-x-2">
                      <Badge variant={property.status === "for_sale" ? "default" : "secondary"}>
                        {formatStatus(property.status)}
                      </Badge>
                      <Badge variant="outline">{formatType(property.type)}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{property.description}</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardContent className="pt-6 space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Contact Owner</h2>
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{property.ownerName}</span>
                  </div>
                  {property.ownerPhone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <span>{property.ownerPhone}</span>
                    </div>
                  )}
                  <Button className="w-full" size="lg">
                    Contact Owner
                  </Button>
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
