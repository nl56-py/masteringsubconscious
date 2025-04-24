
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Database } from "@/integrations/supabase/types";
import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";

type BlogRow = Database['public']['Tables']['blog_posts']['Row'];

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image_url: string | null;
  image_url_2: string | null;
  image_url_3: string | null;
  image_alt: string | null;
  image_alt_2: string | null;
  image_alt_3: string | null;
  slug: string | null;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(posts.map(post => post.category)));
      setCategories(uniqueCategories);
    }
  }, [posts]);

  useEffect(() => {
    let results = [...posts];
    
    // Filter by search term if present
    if (searchTerm.trim() !== "") {
      const lowercaseSearch = searchTerm.toLowerCase();
      results = results.filter((post) => 
        post.title.toLowerCase().includes(lowercaseSearch) || 
        post.content.toLowerCase().includes(lowercaseSearch) ||
        post.excerpt.toLowerCase().includes(lowercaseSearch) ||
        post.category.toLowerCase().includes(lowercaseSearch) ||
        post.author.toLowerCase().includes(lowercaseSearch)
      );
    }
    
    // Filter by category if selected
    if (selectedCategory) {
      results = results.filter(post => post.category === selectedCategory);
    }
    
    setFilteredPosts(results);
  }, [searchTerm, posts, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("date", { ascending: false });

      if (error) throw error;
      
      // Add slugs if they don't exist and handle all fields including the new image fields
      const postsWithSlugs = (data || []).map(post => {
        if (!post.slug) {
          // Generate a slug from the title
          const generatedSlug = post.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          
          return {
            ...post,
            slug: generatedSlug,
            image_url_2: post.image_url_2 || null,
            image_url_3: post.image_url_3 || null,
            image_alt: post.image_alt || null,
            image_alt_2: post.image_alt_2 || null,
            image_alt_3: post.image_alt_3 || null
          } as BlogPost;
        }
        return {
          ...post,
          image_url_2: post.image_url_2 || null,
          image_url_3: post.image_url_3 || null,
          image_alt: post.image_alt || null,
          image_alt_2: post.image_alt_2 || null,
          image_alt_3: post.image_alt_3 || null
        } as BlogPost;
      });
      
      setPosts(postsWithSlugs);
      setFilteredPosts(postsWithSlugs);
    } catch (err: any) {
      console.error("Error fetching posts:", err);
      setError(err.message || "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Blog | PSYCH-K® Facilitation - Personal Development Insights</title>
        <meta name="description" content="Explore our insights on PSYCH-K® techniques, personal development, and subconscious reprogramming to transform your life and mindset." />
        <meta name="keywords" content="PSYCH-K, personal development, subconscious reprogramming, mindset transformation, beliefs" />
        <meta property="og:title" content="Blog | PSYCH-K® Facilitation" />
        <meta property="og:description" content="Explore our insights on PSYCH-K® techniques, personal development, and subconscious reprogramming." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | PSYCH-K® Facilitation" />
        <meta name="twitter:description" content="Explore insights on PSYCH-K® techniques and subconscious reprogramming." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-center mb-4 text-gradient">Latest Updates</h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore our insights on PSYCH-K® techniques, personal development, and subconscious reprogramming
        </p>
        
        {/* Search and Categories */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-6">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search blog posts"
              />
            </div>
          </div>
          
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`category-badge ${!selectedCategory ? 'bg-primary text-white hover:bg-primary/80' : ''}`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-badge flex items-center gap-1 ${selectedCategory === category ? 'bg-primary text-white hover:bg-primary/80' : ''}`}
                >
                  <Tag className="size-3" />
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            {error}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {searchTerm || selectedCategory ? "No matching blog posts found." : "No blog posts available yet."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.slug}`}
                className="glass-card rounded-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image_url || '/placeholder.svg'} 
                    alt={post.image_alt || post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-primary">{formatDate(post.date)}</span>
                    <span className="category-badge">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  <p className="text-primary font-medium flex items-center hover:underline">Read More →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
