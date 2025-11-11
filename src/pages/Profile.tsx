import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { uploadToCloudinary } from "@/lib/cloudinary";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Crown, Upload, Calendar } from "lucide-react";

const Profile = () => {
  const { currentUser, userData, isPremium, refreshPremiumStatus } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [premiumDays, setPremiumDays] = useState(30);

  useEffect(() => {
    if (userData?.photoURL) {
      setPreviewUrl(userData.photoURL);
    }
  }, [userData]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdatePhoto = async () => {
    if (!photoFile || !currentUser) return;

    setIsLoading(true);
    try {
      const photoURL = await uploadToCloudinary(photoFile);
      
      await firestore().collection("users").doc(currentUser.uid).update({
        photoURL,
      });

      toast.success("Profile photo updated!");
      setPhotoFile(null);
    } catch (error) {
      console.error("Error updating photo:", error);
      toast.error("Failed to update photo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivatePremium = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + premiumDays);

      await firestore().collection("users").doc(currentUser.uid).update({
        isPremium: true,
        premiumExpiryDate: expiryDate,
      });

      await refreshPremiumStatus();
      toast.success(`Premium activated for ${premiumDays} days!`);
    } catch (error) {
      console.error("Error activating premium:", error);
      toast.error("Failed to activate premium");
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysRemaining = () => {
    if (!userData?.premiumExpiryDate) return 0;
    const now = new Date();
    const expiry = new Date(userData.premiumExpiryDate);
    const diff = expiry.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Manage your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userData?.displayName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload">
                    <Button variant="outline" asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </span>
                    </Button>
                  </label>
                  {photoFile && (
                    <Button onClick={handleUpdatePhoto} disabled={isLoading} className="ml-2">
                      Save Photo
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={userData?.displayName || ""} disabled />
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={userData?.email || ""} disabled />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="h-6 w-6 mr-2 text-primary" />
                Premium Membership
              </CardTitle>
              <CardDescription>
                Premium members can add and manage property listings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isPremium ? (
                <div className="space-y-4">
                  <Badge className="text-lg py-2 px-4">
                    <Crown className="h-4 w-4 mr-2" />
                    Active Premium Member
                  </Badge>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{getDaysRemaining()} days remaining</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Activate premium to start listing properties
                  </p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="premium-days">Duration (days)</Label>
                      <Input
                        id="premium-days"
                        type="number"
                        min="1"
                        value={premiumDays}
                        onChange={(e) => setPremiumDays(parseInt(e.target.value))}
                      />
                    </div>
                    <Button
                      onClick={handleActivatePremium}
                      disabled={isLoading}
                      size="lg"
                      className="mt-6"
                    >
                      Activate Premium
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Note: In production, this would integrate with a payment system
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
