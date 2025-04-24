
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Brain } from "lucide-react";

const PsychK = () => {
  // SEO metadata
  const pageTitle = "PSYCH-K® Subconscious Reprogramming | Transform Limiting Beliefs";
  const pageDescription = "Discover PSYCH-K®, a powerful approach to subconscious mind reprogramming that creates lasting change quickly and easily. Learn how to transform limiting beliefs into supportive ones.";
  const pageKeywords = "PSYCH-K, subconscious reprogramming, limiting beliefs, whole brain state, personal transformation, Rob Williams, mind reprogramming";
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "publisher": {
      "@type": "Organization",
      "name": "PSYCH-K® Facilitation",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + "/favicon.ico"
      }
    },
    "mainEntity": {
      "@type": "Service",
      "name": "PSYCH-K® Facilitation",
      "description": "A powerful approach to subconscious mind reprogramming that creates lasting change quickly and easily",
      "provider": {
        "@type": "Organization",
        "name": "PSYCH-K® Facilitation"
      },
      "serviceType": "Mind Reprogramming"
    }
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
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1">
        <Hero
          title="PSYCH-K®"
          subtitle="A powerful approach to subconscious mind reprogramming that creates lasting change quickly and easily"
          centered
          gradient
        />
        
        <section className="py-12">
          <div className="container">
            <div className="max-w-3xl mx-auto">
              <div className="mb-12 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">What is PSYCH-K?</h2>
                <p className="text-lg text-muted-foreground">
                  PSYCH-K® is a unique and direct way to change subconscious beliefs that perpetuate old habits of thinking and behaving that you would like to change. It is a simple process that helps you communicate with your subconscious mind so you can change beliefs that limit your self-esteem, relationships, job performance, and even your physical health.
                </p>
                <p className="text-muted-foreground">
                  Developed by Rob Williams in 1988, PSYCH-K was inspired by a variety of processes including Neuro-Linguistic Programming (NLP), Psycho-spiritual processes, and various mind/body healing techniques.
                </p>
              </div>
              
              <div className="mb-12 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">How PSYCH-K Reprograms the Subconscious</h2>
                <p className="text-muted-foreground">
                  PSYCH-K works by creating a receptive state of mind that dramatically reduces resistance to change in the subconscious. The process works by:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <p>Creating a whole-brain state that dramatically reduces resistance to change</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <p>Using muscle testing to communicate directly with your subconscious mind</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <p>Identifying limiting beliefs that may be sabotaging your success</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <p>Replacing these beliefs with self-enhancing ones that support your goals</p>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <p>Creating lasting changes through neuroscience-based techniques</p>
                  </li>
                </ul>
              </div>
              
              <Tabs defaultValue="beliefs" className="mb-12">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="beliefs">Subconscious Beliefs</TabsTrigger>
                  <TabsTrigger value="process">The PSYCH-K Process</TabsTrigger>
                </TabsList>
                <TabsContent value="beliefs" className="space-y-6 pt-6">
                  <h3 className="text-xl font-semibold">How Beliefs Impact Your Life</h3>
                  <p className="text-muted-foreground">
                    Beliefs are the foundation of our behavior. They shape our perception of reality and influence how we respond to the world. The subconscious mind is where these beliefs are stored, and it operates based on:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <Card className="bg-secondary/30">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">Positive Beliefs</h4>
                        <p className="text-muted-foreground text-sm">Examples: "I am worthy of success," "I am capable of achieving my goals," "I deserve loving relationships"</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-secondary/30">
                      <CardContent className="pt-6">
                        <h4 className="font-medium mb-2">Limiting Beliefs</h4>
                        <p className="text-muted-foreground text-sm">Examples: "I'm not good enough," "Success is for other people," "I don't deserve abundance"</p>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-muted-foreground mt-4">
                    PSYCH-K helps identify and transform these limiting beliefs into supportive ones, creating profound changes in your life experiences.
                  </p>
                </TabsContent>
                <TabsContent value="process" className="space-y-6 pt-6">
                  <h3 className="text-xl font-semibold">The PSYCH-K Facilitation Process</h3>
                  <ol className="space-y-4 mt-4">
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Identification</h4>
                      <p className="text-sm text-muted-foreground">Identify the limiting belief that is holding you back</p>
                    </li>
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Muscle Testing</h4>
                      <p className="text-sm text-muted-foreground">Test to confirm the belief is indeed held in your subconscious</p>
                    </li>
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Whole-Brain State</h4>
                      <p className="text-sm text-muted-foreground">Create a receptive state through specific techniques</p>
                    </li>
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Reprogramming</h4>
                      <p className="text-sm text-muted-foreground">Install the new, positive belief into the subconscious</p>
                    </li>
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Verification</h4>
                      <p className="text-sm text-muted-foreground">Confirm that the new belief is accepted by the subconscious</p>
                    </li>
                    <li className="border-l-4 border-primary pl-4 py-2">
                      <h4 className="font-medium">Integration</h4>
                      <p className="text-sm text-muted-foreground">Allow the new belief to integrate and create changes in your life</p>
                    </li>
                  </ol>
                </TabsContent>
              </Tabs>
              
              <div className="bg-muted p-8 rounded-lg border border-border mb-12">
                <div className="flex items-start gap-4">
                  <Brain className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Key Benefits of PSYCH-K</h3>
                    <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Rapidly change limiting beliefs</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Reduce stress and anxiety</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Enhance confidence and self-esteem</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Improve relationships</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Achieve goals more easily</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Enhance career performance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Support physical healing</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        <span className="text-muted-foreground">Create lasting behavioral change</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to Transform Your Subconscious Mind?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Experience the power of PSYCH-K facilitation with N.L BHATTARAI,
                  a certified practitioner specialized in personal and executive transformation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/sessions">Book a Session</Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/facilitator">Meet the Facilitator</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PsychK;
