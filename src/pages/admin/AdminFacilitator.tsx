
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, Save } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/integrations/supabase/types";

type FacilitatorRow = Database['public']['Tables']['facilitator']['Row'];

interface FacilitatorFormData {
  name: string;
}

interface Facilitator {
  id: string;
  name: string;
  image_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

const AdminFacilitator = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [facilitator, setFacilitator] = useState<Facilitator | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FacilitatorFormData>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    fetchFacilitator();
  }, []);

  const fetchFacilitator = async () => {
    try {
      const { data, error } = await supabase
        .from("facilitator")
        .select("id, name, image_url, bio, created_at, updated_at")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error, which is expected if no facilitator exists
        throw error;
      }

      if (data) {
        // Type assertion for the facilitator data
        const facilitatorData = data as unknown as Facilitator;
        setFacilitator(facilitatorData);
        setValue("name", facilitatorData.name);
        setImageUrl(facilitatorData.image_url);
      }
    } catch (error) {
      console.error("Error fetching facilitator:", error);
      toast({
        title: "Error",
        description: "Failed to load facilitator information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Max size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setImageFile(file);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return imageUrl;
    
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `facilitator_${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    setIsUploading(true);

    try {
      // If there's an existing image, delete it first
      if (imageUrl) {
        const oldFileName = imageUrl.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("facilitator-images")
            .remove([oldFileName]);
        }
      }

      // Upload the new image
      const { error: uploadError } = await supabase.storage
        .from("facilitator-images")
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("facilitator-images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FacilitatorFormData) => {
    try {
      setSaving(true);
      
      // Upload image if new image is selected
      let finalImageUrl = imageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImage();
      }

      // Generate a bio based on the name
      const generatedBio = `${data.name} is a certified PSYCH-K® facilitator dedicated to helping individuals transform their lives through subconscious reprogramming. With extensive training and a passion for personal growth, ${data.name} guides clients to identify and change limiting beliefs that may be holding them back from reaching their full potential.`;

      const facilitatorData = {
        name: data.name,
        image_url: finalImageUrl,
        bio: generatedBio,  // Include the auto-generated bio
        updated_at: new Date().toISOString(),
      };

      let result;
      if (facilitator) {
        // Update existing facilitator
        result = await supabase
          .from("facilitator")
          .update(facilitatorData)
          .eq("id", facilitator.id);
      } else {
        // Create new facilitator
        result = await supabase
          .from("facilitator")
          .insert([facilitatorData]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: "Facilitator information saved successfully",
      });
      
      // Refresh data
      fetchFacilitator();
    } catch (error) {
      console.error("Error saving facilitator:", error);
      toast({
        title: "Error",
        description: "Failed to save facilitator information",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Facilitator Management">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Facilitator Management">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      {...register("name", { required: "Name is required" })}
                      placeholder="Facilitator name"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Note: Facilitator bio is automatically generated based on the name. You only need to provide the name and image.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Profile Image</Label>
                    {imageUrl && (
                      <div className="mb-4">
                        <img
                          src={imageUrl}
                          alt="Facilitator"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Label
                        htmlFor="image"
                        className="cursor-pointer flex items-center justify-center h-10 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select Image
                      </Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {imageFile && (
                        <span className="text-sm text-gray-500 truncate max-w-[150px]">
                          {imageFile.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              disabled={saving || isUploading}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> 
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminFacilitator;
