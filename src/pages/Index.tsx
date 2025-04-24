
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Brain, BookOpen, Rocket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type FacilitatorRow = Database['public']['Tables']['facilitator']['Row'];

interface FacilitatorData {
  id: string;
  name: string;
  image_url: string | null;
}

const Index = () => {
  const [facilitator, setFacilitator] = useState<FacilitatorData | null>(null);
  const [loading, setLoading] = useState(true);

  // SEO metadata
  const pageTitle = "Mastering Subconscious | PSYCH-K® Facilitation | Master Your Subconscious Mind";
  const pageDescription = "Transform your life through PSYCH-K® subconscious reprogramming. Overcome limiting beliefs and unlock your full potential with certified facilitation.";
  const pageKeywords = "PSYCH-K, subconscious mind, limiting beliefs, personal transformation, mind reprogramming, executive coaching, facilitation";
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "PSYCH-K® Facilitation",
    "url": window.location.origin,
    "description": pageDescription,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.origin}/blog?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PSYCH-K® Facilitation",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/favicon.ico`
      }
    }
  };

  useEffect(() => {
    const fetchFacilitator = async () => {
      try {
        const { data, error } = await supabase
          .from("facilitator")
          .select("id, name, image_url")
          .limit(1)
          .single();

        if (error) throw error;
        setFacilitator(data as FacilitatorData);
      } catch (err) {
        console.error("Error fetching facilitator:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitator();
  }, []);

  // Generate a short paragraph about the facilitator
  const generateFacilitatorIntro = (name: string) => {
    return `With extensive training in PSYCH-K methodologies and a passion for helping others unlock their full potential, ${name} guides individuals and executives through the powerful process of subconscious reprogramming. Drawing from years of experience in both personal transformation and executive coaching, they create a safe, supportive environment for you to identify and transform limiting beliefs.`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/placeholder.svg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <link rel="canonical" href={window.location.origin} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1">
        <Hero 
          title="Master Your Subconscious Mind"
          subtitle="Unlock your full potential through subconscious reprogramming with PSYCH-K"
          gradient
          centered
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/sessions">Book a Session</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/psych-k">Learn About PSYCH-K</Link>
            </Button>
          </div>
        </Hero>
        
        {/* About the Subconscious Mind */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Understanding the Subconscious Mind</h2>
                <p className="text-lg text-muted-foreground">
                  The subconscious mind is the powerful background processor of your brain, controlling 95% of your cognitive activity
                  without your awareness. It stores your beliefs, memories, and habits—shaping how you perceive and interact with the world.
                </p>
                <p className="text-lg text-muted-foreground">
                  While your conscious mind thinks in words and logic, your subconscious communicates through emotions, symbols, and images.
                  It's always active, even during sleep, continuously influencing your decisions, behaviors, and outcomes in life.
                </p>
                <Button asChild variant="outline">
                  <Link to="/psych-k" className="group">
                    Discover how to reprogram it
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
              <div className="bg-muted p-8 rounded-lg border border-border relative">
                <div className="absolute -top-3 -left-3 bg-primary text-primary-foreground p-2 rounded">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-4">Key Facts About Your Subconscious</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-medium">1</span>
                    </div>
                    <p>Controls 95-99% of your thoughts, behaviors, and actions</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-medium">2</span>
                    </div>
                    <p>Formed primarily during childhood from experiences and programming</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <p>Creates self-limiting beliefs that may be holding you back</p>
                  </li>
                  <li className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-sm font-medium">4</span>
                    </div>
                    <p>Can be reprogrammed through specific techniques like PSYCH-K</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Transform Your Mind, Transform Your Life</h2>
              <p className="text-lg text-muted-foreground">
                Discover our comprehensive approach to subconscious reprogramming for personal and professional growth.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>PSYCH-K Facilitation</CardTitle>
                  <CardDescription>
                    A powerful approach to reprogram your subconscious beliefs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    PSYCH-K uses simple but effective techniques to rewrite limiting beliefs and create lasting personal change.
                  </p>
                  <Button asChild variant="ghost" className="group">
                    <Link to="/psych-k">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Executive Coaching</CardTitle>
                  <CardDescription>
                    For business leaders and high-performing professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Enhance leadership skills, decision making, and resilience through subconscious mind mastery.
                  </p>
                  <Button asChild variant="ghost" className="group">
                    <Link to="/business-benefits">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-2">
                  <div className="p-2 w-12 h-12 rounded-full bg-primary/10 mb-4 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Personal Transformation</CardTitle>
                  <CardDescription>
                    Break free from limiting patterns and create lasting change
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Address anxiety, confidence issues, relationships, and personal growth through targeted sessions.
                  </p>
                  <Button asChild variant="ghost" className="group">
                    <Link to="/sessions">
                      Learn more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Facilitator */}
        <section className="py-20">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-muted rounded-lg border border-border aspect-square flex items-center justify-center overflow-hidden">
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                ) : facilitator?.image_url ? (
                  <img 
                    src={facilitator.image_url} 
                    alt={facilitator.name || "Facilitator"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8 rounded-full bg-secondary/50 size-64 flex items-center justify-center animate-float">
                    <p className="text-lg text-primary font-medium">{facilitator?.name || "FACILITATOR"}</p>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Meet Your Facilitator</h2>
                <h3 className="text-2xl font-semibold">{facilitator?.name || "Your PSYCH-K Expert"}</h3>
                <p className="text-lg text-muted-foreground">
                  {facilitator?.name ? generateFacilitatorIntro(facilitator.name) : 
                    "Our certified PSYCH-K facilitator brings expertise and compassion to guide you through the powerful process of subconscious reprogramming. With specialized training and a dedication to helping others reach their full potential, they provide a safe environment for transformation."}
                </p>
                <Button asChild>
                  <Link to="/facilitator">Learn More About {facilitator?.name || "Our Facilitator"}</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                Ready to Transform Your Subconscious Programming?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book a session with {facilitator?.name || "our facilitator"} and begin your journey toward unlocking your full potential
                through effective subconscious reprogramming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/sessions">Book Your Session</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/blog">Read Success Stories</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
