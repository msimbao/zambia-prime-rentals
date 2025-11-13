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
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-0 shadow-lg bg-white h-full flex flex-col">
        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {property.images && property.images.length > 0 ? (
            <img
              src={getOptimizedImageUrl(property.images[0], { width: 400, height: 300 })}
              alt={property.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No image</p>
              </div>
            </div>
          )}
          {/* Gradient overlay for better badge visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="absolute top-3 right-3">
            <Badge 
              variant={property.status === "for_sale" ? "default" : "secondary"}
              className="shadow-lg backdrop-blur-sm bg-opacity-95 px-3 py-1.5 text-xs font-semibold"
            >
              {formatStatus(property.status)}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-5 flex-1 flex flex-col">
          <h3 className="font-bold text-xl mb-3 line-clamp-2 text-gray-900 group-hover:text-primary transition-colors">
            {property.name}
          </h3>
          
          <div className="flex items-baseline mb-4">
            <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/80">
              {formatPrice(property.price)}
            </p>
            {property.status === "for_rent" && (
              <span className="text-sm text-gray-500 ml-1 font-medium">/month</span>
            )}
          </div>
          
          <div className="space-y-2 mt-auto">
            <div className="flex items-center text-sm text-gray-600">
              <div className="bg-gray-100 p-1.5 rounded-lg mr-2">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <span className="line-clamp-1">{property.location}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <div className="bg-gray-100 p-1.5 rounded-lg mr-2">
                <Maximize2 className="h-4 w-4 text-primary" />
              </div>
              <span>{property.size} {property.sizeUnit}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 border-t border-gray-100 mt-2">
          <Badge 
            variant="outline" 
            className="border-2 border-gray-200 text-gray-700 px-3 py-1 text-xs font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            {formatType(property.type)}
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default PropertyCard;