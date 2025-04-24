import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        const { data: allPosts, error: allPostsError } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true);
          
        if (allPostsError) throw allPostsError;
        
        const matchingPost = allPosts?.find(post => {
          const generatedSlug = post.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
          return generatedSlug === slug;
        });
        
        if (matchingPost) {
          setPost({
            ...matchingPost,
            slug: matchingPost.slug || matchingPost.title
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
          } as unknown as BlogPost);
        } else {
          setError("Blog post not found");
        }
      } else {
        setPost({
          ...data,
          slug: data.slug || data.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
        } as unknown as BlogPost);
      }
    } catch (err: any) {
      console.error("Error fetching post:", err);
      setError(err.message || "Failed to load blog post");
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title || 'Blog Post',
        text: post?.excerpt || 'Check out this blog post',
        url: window.location.href,
      })
      .catch((err) => {
        console.error('Error sharing:', err);
        copyToClipboard();
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({ title: "Link copied to clipboard" });
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        toast({ 
          title: "Failed to copy link", 
          variant: "destructive" 
        });
      });
  };

  const generateStructuredData = () => {
    if (!post) return null;
    
    const images = [
      post.image_url,
      post.image_url_2,
      post.image_url_3
    ].filter(Boolean);
    
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": {
        "@type": "Person",
        "name": post.author
      },
      "datePublished": post.date,
      "dateModified": post.date,
      "image": images.length > 0 ? images : [window.location.origin + "/placeholder.svg"],
      "publisher": {
        "@type": "Organization",
        "name": "PSYCH-K® Facilitation",
        "logo": {
          "@type": "ImageObject",
          "url": window.location.origin + "/favicon.ico"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      }
    };
  };

  const renderRichContent = () => {
    if (!post?.content) return null;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = post.content;
    
    const elements = Array.from(tempDiv.childNodes).map(node => {
      const div = document.createElement('div');
      div.appendChild(node.cloneNode(true));
      return div.innerHTML;
    });
    
    const paragraphs = elements.length > 0 ? elements : post.content.split('\n').filter(p => p.trim().length > 0);
    
    if (!post.image_url_2 && !post.image_url_3) {
      return paragraphs.map((paragraph, i) => (
        <div key={i} className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph }} />
      ));
    }
    
    const totalParagraphs = paragraphs.length;
    const image2Index = Math.min(Math.floor(totalParagraphs / 3), 2);
    const image3Index = Math.min(Math.floor(totalParagraphs * 2 / 3), 5);
    
    return paragraphs.map((paragraph, i) => {
      return (
        <div key={i}>
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: paragraph }} />
          
          {i === image2Index && post.image_url_2 && (
            <figure className="my-8">
              <img 
                src={post.image_url_2} 
                alt={post.image_alt_2 || "Additional image for article"} 
                className="w-full rounded-lg shadow-sm"
              />
              {post.image_alt_2 && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {post.image_alt_2}
                </figcaption>
              )}
            </figure>
          )}
          
          {i === image3Index && post.image_url_3 && (
            <figure className="my-8">
              <img 
                src={post.image_url_3} 
                alt={post.image_alt_3 || "Additional image for article"} 
                className="w-full rounded-lg shadow-sm"
              />
              {post.image_alt_3 && (
                <figcaption className="text-center text-sm text-gray-500 mt-2">
                  {post.image_alt_3}
                </figcaption>
              )}
            </figure>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog" className="text-blue-600 hover:underline flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const jsonLd = generateStructuredData();

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{post.title} | PSYCH-K® Facilitation</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={`${post.category}, PSYCH-K, personal development, ${post.title.toLowerCase()}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={post.author} />
        <meta property="article:section" content={post.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        {post.image_url && post.image_alt && <meta name="twitter:image:alt" content={post.image_alt} />}
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>
      
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex justify-between items-center">
          <Link to="/blog" className="text-blue-600 hover:underline flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center"
          >
            <Share className="w-4 h-4 mr-2" /> Share
          </Button>
        </div>
        
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {post.image_url && (
            <div className="w-full h-[500px]">
              <img 
                src={post.image_url} 
                alt={post.image_alt || post.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center text-gray-600 mb-4 flex-wrap">
                <span>{post.author}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.date)}</span>
                <span className="mx-2">•</span>
                <span className="bg-gray-100 px-2 py-1 rounded">{post.category}</span>
              </div>
            </header>
            
            <div className="prose max-w-none rich-content">
              {renderRichContent()}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
