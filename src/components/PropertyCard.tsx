import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Property } from "@/types/property";
import { MapPin, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getOptimizedImageUrl } from "@/lib/imageOptimization";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
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
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {property.images && property.images.length > 0 ? (
            <img
              src={getOptimizedImageUrl(property.images[0], { width: 400, height: 300 })}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant={property.status === "for_sale" ? "default" : "secondary"}>
              {formatStatus(property.status)}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{property.name}</h3>
          <p className="text-2xl font-bold text-primary mb-2">{formatPrice(property.price)}</p>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Maximize2 className="h-4 w-4 mr-1" />
            {property.size} {property.sizeUnit}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Badge variant="outline">{formatType(property.type)}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;
