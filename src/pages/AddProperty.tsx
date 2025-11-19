import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { compressMultipleImages, CompressionProgress } from "@/lib/imageOptimization";
import { PREMIUM_TIERS } from "@/config/premiumTiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Upload, X, Video, AlertCircle } from "lucide-react";
import LoadingOverlay from '@/components/LoadingOverlay';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AddProperty = () => {
  const { currentUser, userData, isPremium, premiumTier } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [isLoading, setIsLoading] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<CompressionProgress | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState<string[]>([]);
  const [existingVideos, setExistingVideos] = useState<string[]>([]);

  // Get tier limits
  const tierLimits = premiumTier && PREMIUM_TIERS[premiumTier as keyof typeof PREMIUM_TIERS]
    ? PREMIUM_TIERS[premiumTier as keyof typeof PREMIUM_TIERS]
    : PREMIUM_TIERS.silver;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    currency: "ZMW",
    pricePeriod: "per_month",
    status: "for_rent",
    type: "apartment",
    location: "",
    size: "",
    sizeUnit: "m2",
    description: "",
    ownerPhone: "",
    ownerName: ""
  });

  useEffect(() => {
    if (editId) {
      loadProperty(editId);
    }
  }, [editId]);

  const loadProperty = async (propertyId: string) => {
    try {
      const doc = await firestore().collection("properties").doc(propertyId).get();
      if (doc.exists) {
        const data = doc.data();
        setFormData({
          name: data.name,
          price: data.price.toString(),
          currency: data.currency || "ZMW",
          pricePeriod: data.pricePeriod || "per_month",
          status: data.status,
          type: data.type,
          location: data.location,
          size: data.size.toString(),
          sizeUnit: data.sizeUnit,
          description: data.description,
          ownerPhone: data.ownerPhone || "",
          ownerName: data.ownerName || "",
        });
        setExistingImages(data.images || []);
        setExistingVideos(data.videos || []);
        setPreviewUrls(data.images || []);
        setVideoPreviewUrls(data.videos || []);
      }
    } catch (error) {
      console.error("Error loading property:", error);
      toast.error("Failed to load property");
    }
  };

  if (!isPremium && !editId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Premium Membership Required</h1>
          <p className="text-muted-foreground mb-6">
            You need a premium membership to add properties.
          </p>
          <Button onClick={() => navigate("/premium")}>Upgrade to Premium</Button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + images.length + files.length;
    
    if (totalImages > tierLimits.maxImages) {
      toast.error(`Your ${tierLimits.name} plan allows maximum ${tierLimits.maxImages} images per property`);
      return;
    }

    setImages([...images, ...files]);
    
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalVideos = existingVideos.length + videos.length + files.length;
    
    if (totalVideos > tierLimits.maxVideos) {
      toast.error(`Your ${tierLimits.name} plan allows maximum ${tierLimits.maxVideos} videos per property`);
      return;
    }

    // Validate file size (max 100MB per video)
    const invalidFiles = files.filter(file => file.size > 100 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Video files must be less than 100MB each");
      return;
    }

    // Validate file format
    const validFormats = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
    const invalidFormats = files.filter(file => !validFormats.includes(file.type));
    if (invalidFormats.length > 0) {
      toast.error("Only MP4, MOV, and AVI video formats are supported");
      return;
    }

    setVideos([...videos, ...files]);
    
    const newVideoPreviewUrls = files.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls([...videoPreviewUrls, ...newVideoPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
    setPreviewUrls(newPreviewUrls);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    const newVideoPreviewUrls = videoPreviewUrls.filter((_, i) => i !== index);
    setVideos(newVideos);
    setVideoPreviewUrls(newVideoPreviewUrls);
  };

  const removeExistingVideo = (index: number) => {
    const newExistingVideos = existingVideos.filter((_, i) => i !== index);
    const newVideoPreviewUrls = videoPreviewUrls.filter((_, i) => i !== index);
    setExistingVideos(newExistingVideos);
    setVideoPreviewUrls(newVideoPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!images.length && !existingImages.length) {
      toast.error("Please add at least one image");
      return;
    }

    setIsLoading(true);

    try {
      // Compress images before upload
      let compressedImages: File[] = [];
      if (images.length > 0) {
        toast.info("Compressing images...");
        compressedImages = await compressMultipleImages(images, (progress) => {
          setCompressionProgress(progress);
        });
        setCompressionProgress(null);
      }

      // Upload compressed images to Cloudinary
      const newImageUrls = compressedImages.length > 0 
        ? await uploadMultipleToCloudinary(compressedImages) 
        : [];
      const allImageUrls = [...existingImages, ...newImageUrls];

      // Upload videos to Cloudinary
      let newVideoUrls: string[] = [];
      if (videos.length > 0) {
        toast.info("Uploading videos...");
        newVideoUrls = await Promise.all(
          videos.map(async (video) => {
            return await uploadToCloudinary(video);
          })
        );
      }
      const allVideoUrls = [...existingVideos, ...newVideoUrls];

      const propertyData = {
        name: formData.name,
        price: parseFloat(formData.price),
        currency: formData.currency,
        pricePeriod: formData.pricePeriod,
        images: allImageUrls,
        videos: allVideoUrls,
        status: formData.status,
        type: formData.type,
        location: formData.location,
        size: parseFloat(formData.size),
        sizeUnit: formData.sizeUnit,
        description: formData.description,
        ownerPhone: formData.ownerPhone,
        ownerIsPremium: isPremium,
        ownerPremiumTier: premiumTier,
        ownerPremiumExpiry: userData?.premiumExpiryDate || null,
        updatedAt: new Date(),
      };

      if (editId) {
        // Update existing property
        await firestore().collection("properties").doc(editId).update(propertyData);
        toast.success("Property updated successfully!");
      } else {
        // Create new property
        await firestore().collection("properties").add({
          ...propertyData,
          ownerId: currentUser.uid,
          ownerName: formData.ownerName || userData?.displayName,
          createdAt: new Date(),
        });
        toast.success("Property added successfully!");
      }

      navigate("/profile");
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error(editId ? "Failed to update property" : "Failed to add property");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
            {/* Loading Overlay */}
      <LoadingOverlay 
        isLoading={isLoading} 
        message={compressionProgress 
          ? "Compressing images..." 
          : editId 
            ? "Updating Property..." 
            : "Adding Property..."}
        progress={compressionProgress?.percentage || null}
      />

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">
              {editId ? "Edit Property" : "Add New Property"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ZMW">ZMW</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePeriod">Period</Label>
                  <Select
                    value={formData.pricePeriod}
                    onValueChange={(value) => setFormData({ ...formData, pricePeriod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_month">Per Month</SelectItem>
                      <SelectItem value="per_week">Per Week</SelectItem>
                      <SelectItem value="per_day">Per Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="for_rent">For Rent</SelectItem>
                    <SelectItem value="for_sale">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="furnished_apartment">Furnished Apartment</SelectItem>
                    <SelectItem value="office_space">Office Space</SelectItem>
                    <SelectItem value="boarding_house">Boarding House</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Lusaka, Woodlands"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    type="number"
                    step="0.01"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sizeUnit">Unit</Label>
                  <Select
                    value={formData.sizeUnit}
                    onValueChange={(value) => setFormData({ ...formData, sizeUnit: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="m2">m²</SelectItem>
                      <SelectItem value="sqf">sqf</SelectItem>
                      <SelectItem value="ha">ha</SelectItem>
                      <SelectItem value="bedroom">bedroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerName">Owner Name</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Actual Owner (Leave Blank if it is you)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Contact Phone (Optional)</Label>
                <Input
                  id="ownerPhone"
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                  placeholder="+260..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Images (Max {tierLimits.maxImages})</Label>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Your {tierLimits.name} plan allows up to {tierLimits.maxImages} images and {tierLimits.maxVideos} videos per property.
                    {existingImages.length + images.length}/{tierLimits.maxImages} images used
                  </AlertDescription>
                </Alert>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={existingImages.length + images.length >= tierLimits.maxImages}
                  />
                  <label 
                    htmlFor="image-upload" 
                    className={existingImages.length + images.length >= tierLimits.maxImages ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {existingImages.length + images.length >= tierLimits.maxImages 
                        ? "Maximum images reached" 
                        : `Click to upload ${existingImages.length > 0 ? "more images" : "images"}`}
                    </p>
                  </label>
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (index < existingImages.length) {
                              removeExistingImage(index);
                            } else {
                              removeImage(index - existingImages.length);
                            }
                          }}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {tierLimits.maxVideos > 0 && (
                <div className="space-y-2">
                  <Label>Videos (Max {tierLimits.maxVideos})</Label>
                  <Alert>
                    <Video className="h-4 w-4" />
                    <AlertDescription>
                      {existingVideos.length + videos.length}/{tierLimits.maxVideos} videos used. Max 100MB per video.
                    </AlertDescription>
                  </Alert>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="video/mp4,video/mov,video/avi,video/quicktime"
                      multiple
                      onChange={handleVideoChange}
                      className="hidden"
                      id="video-upload"
                      disabled={existingVideos.length + videos.length >= tierLimits.maxVideos}
                    />
                    <label 
                      htmlFor="video-upload" 
                      className={existingVideos.length + videos.length >= tierLimits.maxVideos ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
                    >
                      <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {existingVideos.length + videos.length >= tierLimits.maxVideos 
                          ? "Maximum videos reached" 
                          : `Click to upload ${existingVideos.length > 0 ? "more videos" : "videos"}`}
                      </p>
                    </label>
                  </div>

                  {videoPreviewUrls.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {videoPreviewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <video
                            src={url}
                            className="w-full h-32 object-cover rounded-lg"
                            controls
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (index < existingVideos.length) {
                                removeExistingVideo(index);
                              } else {
                                removeVideo(index - existingVideos.length);
                              }
                            }}
                            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {compressionProgress 
                  ? `Compressing images... ${compressionProgress.percentage}%`
                  : isLoading 
                    ? (editId ? "Updating Property..." : "Adding Property...") 
                    : (editId ? "Update Property" : "Add Property")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProperty;
