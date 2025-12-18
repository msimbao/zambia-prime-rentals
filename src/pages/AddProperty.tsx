import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/lib/firebase";
import { uploadToCloudinary, uploadMultipleToCloudinary } from "@/lib/cloudinary";
import { compressMultipleImages, CompressionProgress } from "@/lib/imageOptimization";
import { PREMIUM_TIERS, ListingTier } from "@/config/premiumTiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { Upload, X, Video, Eye, EyeOff, Check, Crown } from "lucide-react";
import LoadingOverlay from '@/components/LoadingOverlay';
import { Switch } from "@/components/ui/switch";
import LencoPaymentButton from "@/components/LencoPaymentButton";

const AddProperty = () => {
  const { currentUser, userData } = useAuth();
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
  const [step, setStep] = useState<'details' | 'tier' | 'payment'>('details');
  const [selectedTier, setSelectedTier] = useState<ListingTier>('silver');
  const [existingTier, setExistingTier] = useState<ListingTier | null>(null);

  // Get tier limits based on selected tier
  const tierLimits = PREMIUM_TIERS[selectedTier];

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
    ownerName: "",
    isVisible: true
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
          isVisible: data.isVisible !== false,
        });
        setExistingImages(data.images || []);
        setExistingVideos(data.videos || []);
        setPreviewUrls(data.images || []);
        setVideoPreviewUrls(data.videos || []);
        if (data.listingTier) {
          setSelectedTier(data.listingTier);
          setExistingTier(data.listingTier);
        }
      }
    } catch (error) {
      console.error("Error loading property:", error);
      toast.error("Failed to load property");
    }
  };

  // Require login
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-6">
            You need to be logged in to add properties.
          </p>
          <Button onClick={() => navigate("/auth")}>Login / Sign Up</Button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + images.length + files.length;
    
    if (totalImages > tierLimits.maxImages) {
      toast.error(`${tierLimits.name} tier allows maximum ${tierLimits.maxImages} images per property`);
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
      toast.error(`${tierLimits.name} tier allows maximum ${tierLimits.maxVideos} videos per property`);
      return;
    }

    const invalidFiles = files.filter(file => file.size > 100 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      toast.error("Video files must be less than 100MB each");
      return;
    }

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

  const validateDetailsStep = () => {
    if (!formData.name || !formData.price || !formData.location || !formData.size || !formData.description) {
      toast.error("Please fill in all required fields");
      return false;
    }
    if (!images.length && !existingImages.length) {
      toast.error("Please add at least one image");
      return false;
    }
    return true;
  };

  const handleContinueToTier = () => {
    if (validateDetailsStep()) {
      setStep('tier');
    }
  };

  const handleSelectTier = (tier: ListingTier) => {
    const totalImages = existingImages.length + images.length;
    const totalVideos = existingVideos.length + videos.length;
    const tierConfig = PREMIUM_TIERS[tier];

    if (totalImages > tierConfig.maxImages) {
      toast.error(`${tierConfig.name} tier only allows ${tierConfig.maxImages} images. Please remove some images or choose a higher tier.`);
      return;
    }
    if (totalVideos > tierConfig.maxVideos) {
      toast.error(`${tierConfig.name} tier only allows ${tierConfig.maxVideos} videos. Please remove some videos or choose a higher tier.`);
      return;
    }

    setSelectedTier(tier);
    setStep('payment');
  };

  const saveProperty = async () => {
    setIsLoading(true);

    try {
      let compressedImages: File[] = [];
      if (images.length > 0) {
        toast.info("Compressing images...");
        compressedImages = await compressMultipleImages(images, (progress) => {
          setCompressionProgress(progress);
        });
        setCompressionProgress(null);
      }

      const newImageUrls = compressedImages.length > 0 
        ? await uploadMultipleToCloudinary(compressedImages) 
        : [];
      const allImageUrls = [...existingImages, ...newImageUrls];

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

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + PREMIUM_TIERS[selectedTier].durationDays);

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
        listingTier: selectedTier,
        listingExpiryDate: expiryDate,
        listingPaidAt: new Date(),
        isVisible: formData.isVisible,
        updatedAt: new Date(),
      };

      if (editId) {
        await firestore().collection("properties").doc(editId).update(propertyData);
        toast.success("Property updated successfully!");
      } else {
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

  const TierCard = ({ tier, config }: { tier: ListingTier; config: typeof PREMIUM_TIERS[ListingTier] }) => {
    const isSelected = selectedTier === tier;
    const colors = {
      silver: 'border-gray-400',
      gold: 'border-yellow-500',
      platinum: 'border-blue-500'
    };
    
    return (
      <Card 
        className={`cursor-pointer transition-all ${isSelected ? `ring-2 ring-primary ${colors[tier]}` : 'hover:shadow-lg'}`}
        onClick={() => handleSelectTier(tier)}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="capitalize">{config.name}</span>
            {tier === 'platinum' && <Crown className="h-5 w-5 text-blue-500" />}
            {tier === 'gold' && <Crown className="h-5 w-5 text-yellow-500" />}
          </CardTitle>
          <CardDescription>
            <span className="text-2xl font-bold text-foreground">K{config.price}</span>
            <span className="text-muted-foreground"> / listing</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {config.features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LoadingOverlay 
        isLoading={isLoading} 
        message={compressionProgress 
          ? "Compressing images..." 
          : editId 
            ? "Updating Property..." 
            : "Adding Property..."}
        progress={compressionProgress?.percentage || null}
      />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex items-center ${step === 'details' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div>
            <span className="ml-2 font-medium">Details</span>
          </div>
          <div className="w-16 h-0.5 bg-muted mx-2"></div>
          <div className={`flex items-center ${step === 'tier' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'tier' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div>
            <span className="ml-2 font-medium">Select Tier</span>
          </div>
          <div className="w-16 h-0.5 bg-muted mx-2"></div>
          <div className={`flex items-center ${step === 'payment' ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        {/* Step 1: Property Details */}
        {step === 'details' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">
                {editId ? "Edit Property" : "Add New Property"}
              </CardTitle>
              <CardDescription>
                Fill in the property details below
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
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
                  <Label htmlFor="location">Location *</Label>
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
                    <Label htmlFor="size">Size *</Label>
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
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {/* Visibility Toggle - Only show when editing */}
                {editId && (
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div className="space-y-1">
                      <Label htmlFor="visibility" className="text-base font-medium flex items-center gap-2">
                        {formData.isVisible ? (
                          <Eye className="h-5 w-5 text-green-600" />
                        ) : (
                          <EyeOff className="h-5 w-5 text-red-600" />
                        )}
                        Property Visibility
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {formData.isVisible 
                          ? "This property is visible in public listings" 
                          : "This property is hidden from public listings"}
                      </p>
                    </div>
                    <Switch
                      id="visibility"
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                    />
                  </div>
                )}

                {/* Images */}
                <div className="space-y-2">
                  <Label>Property Images *</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Images added will be limited based on tier selection in next step
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => index < existingImages.length 
                            ? removeExistingImage(index) 
                            : removeImage(index - existingImages.length)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-2">
                  <Label>Property Videos (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Video limits depend on tier selection
                  </p>
                  
                  <div className="grid grid-cols-4 gap-4">
                    {videoPreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <button
                          type="button"
                          onClick={() => index < existingVideos.length 
                            ? removeExistingVideo(index) 
                            : removeVideo(index - existingVideos.length)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                      <Video className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Video</span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <Button type="button" onClick={handleContinueToTier} className="w-full" size="lg">
                  Continue to Select Tier
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Tier Selection */}
        {step === 'tier' && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Select Listing Tier</h2>
              <p className="text-muted-foreground">Choose how you want your property to be listed</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(PREMIUM_TIERS).map(([tier, config]) => (
                <TierCard key={tier} tier={tier as ListingTier} config={config} />
              ))}
            </div>

            <Button variant="outline" onClick={() => setStep('details')} className="mt-4">
              Back to Details
            </Button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Complete Payment</CardTitle>
              <CardDescription>
                Pay to list your property with {PREMIUM_TIERS[selectedTier].name} tier for {PREMIUM_TIERS[selectedTier].durationDays} days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Property:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tier:</span>
                    <span className="font-medium capitalize">{selectedTier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{PREMIUM_TIERS[selectedTier].durationDays} days</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>K{PREMIUM_TIERS[selectedTier].price}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <LencoPaymentButton
                  publicKey="pk_live_3ca99b10-4e01-11ef-803e-8f5c7f6d94a0"
                  reference={`listing-${selectedTier}-${currentUser?.uid}-${Date.now()}`}
                  email={currentUser?.email || 'user@example.com'}
                  amount={PREMIUM_TIERS[selectedTier].price}
                  title={`Pay K${PREMIUM_TIERS[selectedTier].price}`}
                  backgroundColor={selectedTier === 'platinum' ? '#3B82F6' : selectedTier === 'gold' ? '#EAB308' : '#333'}
                  onSuccess={async () => {
                    await saveProperty();
                  }}
                />
                
                {/* Developer free listing button */}
                {/* ========== DEVELOPER ONLY - COMMENT OUT BEFORE GOING LIVE ========== */}
                <Button 
                  variant="outline" 
                  onClick={saveProperty}
                  disabled={isLoading}
                >
                  🔐 Dev: Skip Payment & List Property
                </Button>
                {/* ========== END DEVELOPER ONLY ========== */}

                <Button variant="ghost" onClick={() => setStep('tier')}>
                  Back to Tier Selection
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AddProperty;
