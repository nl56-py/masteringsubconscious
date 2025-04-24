
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, TrendingUp, Brain, LineChart, Target, Users, Lightbulb, Shield, Clock3, Rocket } from "lucide-react";

const BusinessBenefits = () => {
  // SEO metadata
  const pageTitle = "PSYCH-K® for Business Excellence | Executive Performance";
  const pageDescription = "Enhance executive performance and leadership capabilities through subconscious mind reprogramming with PSYCH-K®. Transform decision-making, strategic thinking, and team dynamics.";
  const pageKeywords = "PSYCH-K for business, executive coaching, leadership development, business transformation, subconscious mind reprogramming, decision-making, strategic thinking";
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "PSYCH-K® for Business Excellence",
    "description": pageDescription,
    "provider": {
      "@type": "Organization",
      "name": "PSYCH-K® Facilitation",
      "logo": {
        "@type": "ImageObject",
        "url": window.location.origin + "/favicon.ico"
      }
    },
    "serviceType": "Executive Coaching",
    "areaServed": {
      "@type": "Country",
      "name": "Global"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Executives, Business Leaders, Managers"
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
          title="Subconscious Mind Mastery for Business Excellence"
          subtitle="How executives and leadership teams achieve breakthrough performance through mental reprogramming"
          centered
          gradient
        />
        
        <section className="py-12">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">The Executive Mind Advantage</h2>
                <p className="text-lg text-muted-foreground">
                  In today's complex business environment, technical skills alone are insufficient for achieving exceptional results. The most successful executives understand that their subconscious mental programming directly impacts their decision-making, leadership effectiveness, and organizational outcomes.
                </p>
                <p className="text-muted-foreground">
                  By mastering your subconscious mind through PSYCH-K and other advanced techniques, you can transform limiting beliefs, enhance leadership capabilities, and create sustainable success for yourself and your organization.
                </p>
                
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg border border-border">
                  <TrendingUp className="h-12 w-12 text-primary" />
                  <div>
                    <h3 className="font-medium">Unlock Peak Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      When your conscious goals align with your subconscious beliefs, extraordinary results become possible.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-muted p-8 rounded-lg border border-border">
                <h3 className="text-xl font-semibold mb-6">Common Executive Challenges Addressed:</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Imposter Syndrome</span>
                      <p className="text-sm text-muted-foreground">Eliminate self-doubt despite achieved success</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Decision Paralysis</span>
                      <p className="text-sm text-muted-foreground">Overcome fear of making the wrong choice</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Strategic Blindness</span>
                      <p className="text-sm text-muted-foreground">See beyond limiting frameworks and mental models</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Leadership Confidence</span>
                      <p className="text-sm text-muted-foreground">Project authentic authority and inspire trust</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                    <div>
                      <span className="font-medium">Work-Life Integration</span>
                      <p className="text-sm text-muted-foreground">Balance high achievement with personal fulfillment</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-6">The Business Impact of Subconscious Reprogramming</h2>
              <p className="text-lg text-muted-foreground">
                When executives master their subconscious programming, the effects ripple throughout the organization,
                creating measurable improvements in key performance areas.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 mb-20">
              <Card>
                <CardHeader>
                  <LineChart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Performance Enhancement</CardTitle>
                  <CardDescription>Measurable improvements in output and results</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Increased productivity through aligned beliefs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Enhanced focus and follow-through capacity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Reduced procrastination and distractibility</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Leadership Excellence</CardTitle>
                  <CardDescription>Transformed relationships and influence</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Improved conflict resolution capabilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Enhanced emotional intelligence and empathy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Greater ability to inspire and motivate others</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Strategic Thinking</CardTitle>
                  <CardDescription>Superior decision-making and vision</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Clearer long-term vision and planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Reduced cognitive biases in decision-making</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2"></div>
                      <span className="text-sm text-muted-foreground">Improved pattern recognition and opportunity spotting</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
            
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl font-bold tracking-tight mb-6">The Executive PSYCH-K Process</h2>
              <p className="text-muted-foreground mb-8">
                Our executive-focused PSYCH-K facilitation is tailored specifically for business leaders and high-performing professionals.
                The process is efficient, confidential, and designed to create lasting improvements in your professional capabilities.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Assessment & Discovery</h3>
                    <p className="text-sm text-muted-foreground">
                      We begin with a thorough assessment of your current limiting beliefs around leadership, decision-making,
                      communication, and other key executive functions.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Targeted Belief Transformation</h3>
                    <p className="text-sm text-muted-foreground">
                      Using PSYCH-K techniques, we reprogram specific limiting beliefs that are hindering your professional
                      performance and replace them with empowering beliefs aligned with your goals.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Integration & Application</h3>
                    <p className="text-sm text-muted-foreground">
                      We provide practical strategies for integrating your new beliefs into daily business activities,
                      ensuring the mental shifts translate into tangible leadership improvements.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock3 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Follow-up & Reinforcement</h3>
                    <p className="text-sm text-muted-foreground">
                      Optional follow-up sessions ensure the sustainability of changes and address any new challenges that emerge
                      as you implement your enhanced leadership capabilities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 p-8 rounded-lg border border-border mb-12">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-6">Executive Case Study</h2>
                <blockquote className="text-lg italic text-muted-foreground mb-6">
                  "As a CEO facing significant organizational changes, I was struggling with self-doubt and decision paralysis. 
                  After working with N.L BHATTARAI and using PSYCH-K to reprogram my subconscious beliefs about leadership during uncertainty, 
                  I've been able to make clearer decisions, communicate more confidently with my team, and ultimately guide our company through 
                  a successful transformation."
                </blockquote>
                <p className="text-right font-medium">— Business Executive, Technology Sector</p>
              </div>
            </div>
            
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Enhance Your Leadership Through Subconscious Mastery</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Book an executive session with N.L BHATTARAI to transform your leadership capabilities
                through targeted subconscious reprogramming.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/sessions">Book an Executive Session</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/facilitator">Meet Your Facilitator</Link>
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

export default BusinessBenefits;
