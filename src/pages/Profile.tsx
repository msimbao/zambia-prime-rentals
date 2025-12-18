import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { firestore } from "@/lib/firebase";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Upload, Save } from "lucide-react";
import MyPropertiesTab from "@/components/MyPropertiesTab";

const Profile = () => {
  const { currentUser, userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  
  const [profileData, setProfileData] = useState({
    displayName: "",
    phone: "",
    whatsapp: "",
    aboutMe: "",
  });

  useEffect(() => {
    if (userData) {
      setPreviewUrl(userData.photoURL || "");
      setProfileData({
        displayName: userData.displayName || "",
        phone: userData.phone || "",
        whatsapp: userData.whatsapp || "",
        aboutMe: userData.aboutMe || "",
      });
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

  const handleSaveProfile = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      await firestore().collection("users").doc(currentUser.uid).update({
        displayName: profileData.displayName,
        phone: profileData.phone,
        whatsapp: profileData.whatsapp,
        aboutMe: profileData.aboutMe,
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="properties">My Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Photo</CardTitle>
                  <CardDescription>Upload a profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={previewUrl} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {profileData.displayName?.charAt(0) || "U"}
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    This information will be displayed on your property listings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name *</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input value={userData?.email || ""} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="+260 xxx xxx xxx"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number</Label>
                      <Input
                        id="whatsapp"
                        value={profileData.whatsapp}
                        onChange={(e) => setProfileData({ ...profileData, whatsapp: e.target.value })}
                        placeholder="+260 xxx xxx xxx"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutMe">About Me</Label>
                    <Textarea
                      id="aboutMe"
                      value={profileData.aboutMe}
                      onChange={(e) => setProfileData({ ...profileData, aboutMe: e.target.value })}
                      placeholder="Tell potential buyers/renters about yourself..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Listing Your Properties</CardTitle>
                  <CardDescription>
                    Each property listing requires a one-time payment based on the tier you choose
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Choose from Silver, Gold, or Platinum tiers when listing a property. Each tier offers different features and duration.
                  </p>
                  <Button onClick={() => window.location.href = '/add-property'}>
                    Add New Property
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="properties" className="mt-6">
            <MyPropertiesTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;