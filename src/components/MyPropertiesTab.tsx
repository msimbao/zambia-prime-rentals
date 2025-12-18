import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { Property } from "@/types/property";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Pencil, Trash2, MapPin, Home, Eye, EyeOff, Clock, Crown, RefreshCw } from "lucide-react";

const MyPropertiesTab = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "ZMW",
    }).format(price);
  };

  const formatType = (type: string) => {
    return type
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    fetchProperties();
  }, [currentUser]);

  const fetchProperties = async () => {
    if (!currentUser) return;

    try {
      const snapshot = await firestore()
        .collection("properties")
        .where("ownerId", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .get();

      const propertyList: Property[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        listingExpiryDate: doc.data().listingExpiryDate?.toDate(),
        listingPaidAt: doc.data().listingPaidAt?.toDate(),
      })) as Property[];

      setProperties(propertyList);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (propertyId: string) => {
    try {
      await firestore().collection("properties").doc(propertyId).delete();
      toast.success("Property deleted successfully");
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    }
  };

  const handleEdit = (propertyId: string) => {
    navigate(`/add-property?edit=${propertyId}`);
  };

  const handleRenew = (propertyId: string) => {
    navigate(`/add-property?edit=${propertyId}`);
  };

  const getStatusBadge = (status: string) => {
    return status === "for_sale" ? "For Sale" : "For Rent";
  };

  const getTypeBadge = (type: string) => {
    const typeMap: Record<string, string> = {
      land: "Land",
      furnished_apartment: "Furnished Apt",
      apartment: "Apartment",
      house: "House",
    };
    return typeMap[type] || type;
  };

  const getListingStatus = (property: Property) => {
    if (!property.listingExpiryDate) {
      return { status: 'expired', label: 'No Listing', color: 'bg-gray-500' };
    }
    
    const now = new Date();
    const expiry = new Date(property.listingExpiryDate);
    const daysRemaining = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining <= 0) {
      return { status: 'expired', label: 'Expired', color: 'bg-red-500' };
    } else if (daysRemaining <= 7) {
      return { status: 'expiring', label: `${daysRemaining}d left`, color: 'bg-yellow-500' };
    } else {
      return { status: 'active', label: `${daysRemaining}d left`, color: 'bg-green-500' };
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-blue-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your properties...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
        <p className="text-muted-foreground mb-4">Start listing your properties to reach potential buyers and renters.</p>
        <Button onClick={() => navigate("/add-property")}>Add Your First Property</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Properties ({properties.length})</h3>
        <Button onClick={() => navigate("/add-property")}>Add New Property</Button>
      </div>

      <div className="grid gap-4">
        {properties.map((property) => {
          const listingStatus = getListingStatus(property);
          
          return (
            <Card key={property.id} className={listingStatus.status === 'expired' ? 'opacity-70' : ''}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{property.name}</h4>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {property.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatPrice(property.price, property.currency)}
                        </p>
                        {property.status === "for_rent" && (
                          <span className="text-sm text-gray-500 ml-1 font-medium">/{formatType(property.pricePeriod || "month")}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3 flex-wrap">
                      <Badge variant="secondary">{getStatusBadge(property.status)}</Badge>
                      <Badge variant="outline">{getTypeBadge(property.type)}</Badge>
                      <Badge variant="outline">
                        {property.size} {property.sizeUnit}
                      </Badge>
                      
                      {/* Tier Badge */}
                      {property.listingTier && (
                        <Badge className={`${getTierBadgeColor(property.listingTier)} text-white flex items-center gap-1`}>
                          <Crown className="h-3 w-3" />
                          {property.listingTier.charAt(0).toUpperCase() + property.listingTier.slice(1)}
                        </Badge>
                      )}
                      
                      {/* Listing Status Badge */}
                      <Badge className={`${listingStatus.color} text-white flex items-center gap-1`}>
                        <Clock className="h-3 w-3" />
                        {listingStatus.label}
                      </Badge>
                      
                      {/* Visibility Badge */}
                      {property.isVisible === false ? (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <EyeOff className="h-3 w-3" />
                          Hidden
                        </Badge>
                      ) : (
                        <Badge variant="default" className="flex items-center gap-1 bg-green-600">
                          <Eye className="h-3 w-3" />
                          Visible
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {property.description}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(property.id)}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>

                      {listingStatus.status === 'expired' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleRenew(property.id)}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Renew Listing
                        </Button>
                      )}

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Property</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{property.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(property.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MyPropertiesTab;
