import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  Loader2, 
  Upload, 
  Save, 
  Image, 
  ImagePlus, 
  X 
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Database } from "@/integrations/supabase/types";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type BlogPostRow = Database['public']['Tables']['blog_posts']['Row'];

interface BlogFormData {
  title: string;
  author: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  slug: string;
  image_alt: string;
  image_alt_2: string;
  image_alt_3: string;
}

interface BlogPost extends BlogFormData {
  id: string;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  date: string;
  created_at: string;
  updated_at: string;
}

// Type for image file state
interface ImageFile {
  file: File | null;
  url: string | null;
  alt: string;
  index: number; // 1, 2, or 3
}

const AdminBlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const { register, handleSubmit, setValue, watch, control, formState: { errors } } = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      author: "",
      category: "",
      excerpt: "",
      content: "",
      published: true,
      slug: "",
      image_alt: "",
      image_alt_2: "",
      image_alt_3: "",
    },
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Track up to 3 images
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([
    { file: null, url: null, alt: "", index: 1 },
    { file: null, url: null, alt: "", index: 2 },
    { file: null, url: null, alt: "", index: 3 }
  ]);

  // Watch the published value for the switch component
  const publishedValue = watch("published");
  const slugValue = watch("slug");

  useEffect(() => {
    if (isEditing) {
      fetchBlogPost();
    }
  }, [id]);

  // Auto-generate slug from title
  useEffect(() => {
    const title = watch("title");
    if (title && !slugValue) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setValue("slug", generatedSlug);
    }
  }, [watch("title")]);

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Blog post not found");

      // Type assertion to handle the data properly
      const blogPost = data as unknown as BlogPost;

      // Populate form fields
      setValue("title", blogPost.title);
      setValue("author", blogPost.author);
      setValue("category", blogPost.category);
      setValue("excerpt", blogPost.excerpt);
      setValue("content", blogPost.content);
      setValue("published", blogPost.published);
      setValue("slug", blogPost.slug || "");
      setValue("image_alt", blogPost.image_alt || "");
      setValue("image_alt_2", blogPost.image_alt_2 || "");
      setValue("image_alt_3", blogPost.image_alt_3 || "");
      
      // Update image state for each image
      setImageFiles([
        { file: null, url: blogPost.image_url, alt: blogPost.image_alt || "", index: 1 },
        { file: null, url: blogPost.image_url_2, alt: blogPost.image_alt_2 || "", index: 2 },
        { file: null, url: blogPost.image_url_3, alt: blogPost.image_alt_3 || "", index: 3 }
      ]);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
      navigate("/admin/blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
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

    // Update the images state
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index - 1] = {
      ...updatedImageFiles[index - 1],
      file,
      url: URL.createObjectURL(file)
    };
    
    setImageFiles(updatedImageFiles);
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    
    // Update the form value
    setValue(`image_alt${index === 1 ? '' : '_' + index}` as keyof BlogFormData, value);
    
    // Also update our local state
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index - 1] = {
      ...updatedImageFiles[index - 1],
      alt: value
    };
    
    setImageFiles(updatedImageFiles);
  };

  const removeImage = (index: number) => {
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index - 1] = { file: null, url: null, alt: "", index };
    setImageFiles(updatedImageFiles);
    
    // Clear the form value
    setValue(`image_alt${index === 1 ? '' : '_' + index}` as keyof BlogFormData, "");
  };

  const uploadImage = async (imageData: ImageFile): Promise<string | null> => {
    if (!imageData.file && !imageData.url) return null;
    
    // If we already have a URL and no new file, just return the existing URL
    if (!imageData.file && imageData.url) return imageData.url;
    
    const fileExt = imageData.file!.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    try {
      // If there's an existing image and we're uploading a new one, delete the old one
      if (imageData.url) {
        const oldFileName = imageData.url.split("/").pop();
        if (oldFileName) {
          await supabase.storage
            .from("blog_images")
            .remove([oldFileName]);
        }
      }

      // Upload the new image
      const { error: uploadError, data } = await supabase.storage
        .from("blog_images")
        .upload(filePath, imageData.file!, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("blog_images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error(`Error uploading image ${imageData.index}:`, error);
      toast({
        title: "Upload failed",
        description: `Failed to upload image ${imageData.index}`,
        variant: "destructive",
      });
      return null;
    }
  };

  // Enhanced handler for pasting rich text content from MS Word
  const handleContentPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Prevent default paste behavior
    e.preventDefault();
    
    // Get clipboard data as HTML
    const clipboardData = e.clipboardData;
    let pastedData = clipboardData.getData('text/html') || clipboardData.getData('text');
    
    // Insert at cursor position or append to existing content
    const textarea = e.currentTarget;
    const currentContent = textarea.value;
    const cursorPosition = textarea.selectionStart;
    
    // Process HTML content
    if (clipboardData.getData('text/html')) {
      // Create a temporary element to clean the HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = pastedData;
      
      // Remove Word-specific XML markup and tags
      // First, remove any XML/Word namespaces and directives
      pastedData = tempDiv.innerHTML
        .replace(/<\?xml.*?>/gi, '') // Remove XML declaration
        .replace(/<w:.*?>/gi, '') // Remove Word namespace tags
        .replace(/<\/w:.*?>/gi, '') // Remove closing Word namespace tags
        .replace(/<m:.*?>/gi, '') // Remove Math namespace tags
        .replace(/<\/m:.*?>/gi, '') // Remove closing Math namespace tags
        .replace(/<o:.*?>/gi, '') // Remove Office namespace tags
        .replace(/<\/o:.*?>/gi, '') // Remove closing Office namespace tags
        .replace(/<xml>.*?<\/xml>/gi, '') // Remove XML blocks
        .replace(/<!--\[.*?\]-->/gi, '') // Remove conditional comments
        .replace(/<!--.*?-->/gi, '') // Remove all other comments
        .replace(/<!\[.*?\]>/gi, '') // Remove CDATA and other declarations
        .replace(/style="[^"]*"/gi, '') // Remove inline styles
        .replace(/class="[^"]*"/gi, ''); // Remove class attributes
      
      // Update the temp div with cleaned content
      tempDiv.innerHTML = pastedData;
      
      // Keep only allowed HTML tags for rich text formatting
      const allowedTags = ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'span'];
      
      // Function to clean nodes recursively
      const cleanNode = (node) => {
        // If it's not an element node, keep it
        if (node.nodeType !== 1) {
          return node.cloneNode(true);
        }
        
        // Check if this is an allowed tag
        const tagName = node.tagName.toLowerCase();
        if (!allowedTags.includes(tagName)) {
          // If not allowed, just keep the text content
          const textNode = document.createTextNode(node.textContent);
          return textNode;
        }
        
        // Create a new clean element
        const cleanElement = document.createElement(tagName);
        
        // Copy text formatting attributes only
        if (node.style) {
          if (node.style.fontWeight === 'bold' || tagName === 'b' || tagName === 'strong') {
            cleanElement.style.fontWeight = 'bold';
          }
          if (node.style.fontStyle === 'italic' || tagName === 'i' || tagName === 'em') {
            cleanElement.style.fontStyle = 'italic';
          }
          if (node.style.textDecoration === 'underline' || tagName === 'u') {
            cleanElement.style.textDecoration = 'underline';
          }
        }
        
        // Process child nodes
        for (let i = 0; i < node.childNodes.length; i++) {
          const cleanChildNode = cleanNode(node.childNodes[i]);
          if (cleanChildNode) {
            cleanElement.appendChild(cleanChildNode);
          }
        }
        
        return cleanElement;
      };
      
      // Create a new clean document fragment
      const fragment = document.createDocumentFragment();
      
      // Process all top-level nodes
      for (let i = 0; i < tempDiv.childNodes.length; i++) {
        const cleanChildNode = cleanNode(tempDiv.childNodes[i]);
        if (cleanChildNode) {
          fragment.appendChild(cleanChildNode);
        }
      }
      
      // Create another temporary container for the cleaned content
      const cleanDiv = document.createElement('div');
      cleanDiv.appendChild(fragment);
      
      // Get the cleaned HTML
      pastedData = cleanDiv.innerHTML
        .replace(/<(?!\/?(b|i|strong|em|u|p|br|h[1-6]|ul|ol|li|span)(?=>|\s.*>))\/?.*?>/gi, ''); // Final sanitization
    }
    
    // Insert content at cursor position
    const newContent = currentContent.substring(0, cursorPosition) + 
                      pastedData + 
                      currentContent.substring(textarea.selectionEnd);
    
    // Update the form value
    setValue("content", newContent);
    
    // Show success toast
    toast({
      title: "Content pasted",
      description: "Formatted content has been inserted and cleaned from Word-specific markup",
    });
  };

  const onSubmit = async (data: BlogFormData) => {
    try {
      setSaving(true);
      
      // Upload each image if new files are selected
      setIsUploading(true);
      
      const [image_url, image_url_2, image_url_3] = await Promise.all([
        uploadImage(imageFiles[0]),
        uploadImage(imageFiles[1]),
        uploadImage(imageFiles[2])
      ]);
      
      setIsUploading(false);

      // Make sure we have a valid slug
      const slug = data.slug || 
        data.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      // Prepare the blog post data
      const blogData = {
        title: data.title,
        author: data.author,
        category: data.category,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published,
        image_url,
        image_url_2,
        image_url_3,
        image_alt: data.image_alt || null,
        image_alt_2: data.image_alt_2 || null,
        image_alt_3: data.image_alt_3 || null,
        slug,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (isEditing) {
        // Update existing blog post
        result = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", id);
      } else {
        // Create new blog post
        result = await supabase
          .from("blog_posts")
          .insert([{ ...blogData, date: new Date().toISOString() }]);
      }

      if (result.error) throw result.error;

      toast({
        title: "Success",
        description: isEditing ? "Blog post updated" : "Blog post created",
      });
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog post:", error);
      toast({
        title: "Error",
        description: "Failed to save blog post",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title={isEditing ? "Edit Blog Post" : "Create New Blog Post"}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEditing ? "Edit Blog Post" : "Create New Blog Post"}>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate("/admin/blogs")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blogs
      </Button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      {...register("title", { required: "Title is required" })}
                      placeholder="Enter blog title"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">{errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                    <Input
                      id="slug"
                      {...register("slug")}
                      placeholder="blog-post-url-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave empty to auto-generate from title
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      {...register("excerpt", { required: "Excerpt is required" })}
                      placeholder="Brief summary of the blog post"
                      rows={3}
                    />
                    {errors.excerpt && (
                      <p className="text-sm text-red-500">{errors.excerpt.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <div className="relative">
                      <Textarea
                        id="content"
                        {...register("content", { required: "Content is required" })}
                        placeholder="Write your blog post content here. You can paste formatted content from Word."
                        rows={10}
                        onPaste={handleContentPaste}
                        className="font-sans"
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background px-2 py-1 rounded">
                        <span className="font-semibold">Tip:</span> Paste from Word to preserve formatting
                      </div>
                    </div>
                    {errors.content && (
                      <p className="text-sm text-red-500">{errors.content.message}</p>
                    )}
                    <div className="bg-muted p-3 rounded-md">
                      <p className="text-sm font-medium">Supported formatting:</p>
                      <div className="flex gap-2 flex-wrap text-xs text-muted-foreground mt-1">
                        <span className="font-bold px-2 py-1 bg-background rounded">Bold</span>
                        <span className="italic px-2 py-1 bg-background rounded">Italic</span>
                        <span className="underline px-2 py-1 bg-background rounded">Underline</span>
                        <span className="px-2 py-1 bg-background rounded">Headings</span>
                        <span className="px-2 py-1 bg-background rounded">Lists</span>
                        <span className="px-2 py-1 bg-background rounded">Paragraphs</span>
                      </div>
                    </div>
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
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      {...register("author", { required: "Author is required" })}
                      placeholder="Author name"
                    />
                    {errors.author && (
                      <p className="text-sm text-red-500">{errors.author.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      {...register("category", { required: "Category is required" })}
                      placeholder="Blog category"
                    />
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="published" className="block mb-1">Published</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="published"
                        checked={publishedValue}
                        onCheckedChange={(checked) => setValue("published", checked)}
                      />
                      <Label htmlFor="published">
                        {publishedValue ? "Published" : "Draft"}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Featured Images */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-base font-medium mb-4">Images (Optional)</h3>
                
                {/* Image 1 */}
                <div className="mb-6 border-b pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Featured Image</Label>
                      {imageFiles[0].url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => removeImage(1)}
                          type="button"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    {imageFiles[0].url && (
                      <div className="mb-3">
                        <img
                          src={imageFiles[0].url}
                          alt="Featured"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {!imageFiles[0].url && (
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="image"
                            className="cursor-pointer flex items-center justify-center h-10 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Select Image
                          </Label>
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, 1)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="image_alt">Alt Text</Label>
                        <Input
                          id="image_alt"
                          {...register("image_alt")}
                          placeholder="Describe the image for accessibility"
                          onChange={(e) => handleAltChange(e, 1)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Provide descriptive text for screen readers and SEO
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded">
                        <p>Recommended dimensions: <strong>1200 x 630px</strong> (16:9 ratio)</p>
                        <p>Will display at 100% width and 500px height on blog post page</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image 2 */}
                <div className="mb-6 border-b pb-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Additional Image 1</Label>
                      {imageFiles[1].url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => removeImage(2)}
                          type="button"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    {imageFiles[1].url && (
                      <div className="mb-3">
                        <img
                          src={imageFiles[1].url}
                          alt="Additional image 1"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {!imageFiles[1].url && (
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="image2"
                            className="cursor-pointer flex items-center justify-center h-10 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Select Image
                          </Label>
                          <Input
                            id="image2"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, 2)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="image_alt_2">Alt Text</Label>
                        <Input
                          id="image_alt_2"
                          {...register("image_alt_2")}
                          placeholder="Describe the image for accessibility"
                          onChange={(e) => handleAltChange(e, 2)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Image 3 */}
                <div className="mb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Additional Image 2</Label>
                      {imageFiles[2].url && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-red-500 hover:text-red-700"
                          onClick={() => removeImage(3)}
                          type="button"
                        >
                          <X className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    {imageFiles[2].url && (
                      <div className="mb-3">
                        <img
                          src={imageFiles[2].url}
                          alt="Additional image 2"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      {!imageFiles[2].url && (
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor="image3"
                            className="cursor-pointer flex items-center justify-center h-10 px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Select Image
                          </Label>
                          <Input
                            id="image3"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageChange(e, 3)}
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="image_alt_3">Alt Text</Label>
                        <Input
                          id="image_alt_3"
                          {...register("image_alt_3")}
                          placeholder="Describe the image for accessibility"
                          onChange={(e) => handleAltChange(e, 3)}
                        />
                      </div>
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
                  {isEditing ? "Update Post" : "Create Post"}
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AdminBlogEdit;
