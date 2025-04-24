import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SessionForm from "@/components/SessionForm";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface FacilitatorData {
  id: string;
  name: string;
  image_url: string | null;
}

const Sessions = () => {
  const [facilitator, setFacilitator] = useState<FacilitatorData | null>(null);

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
      }
    };

    fetchFacilitator();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Book PSYCH-K® Sessions | Mastering Subconscious</title>
        <meta
          name="description"
          content={`Book your personal or executive PSYCH-K® facilitation session with ${
            facilitator?.name || "our expert facilitator"
          } and transform limiting beliefs into empowering ones.`}
        />
        <meta
          name="keywords"
          content="PSYCH-K sessions, belief change, personal transformation, executive coaching, subconscious reprogramming"
        />
        <meta
          property="og:title"
          content="Book PSYCH-K® Sessions | SubMind Mastery"
        />
        <meta
          property="og:description"
          content={`Book your personal or executive PSYCH-K® facilitation session with ${
            facilitator?.name || "our expert facilitator"
          } and transform limiting beliefs.`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Book PSYCH-K® Sessions | SubMind Mastery"
        />
        <meta
          name="twitter:description"
          content="Transform limiting beliefs with our PSYCH-K® facilitation sessions."
        />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "PSYCH-K® Facilitation Sessions",
            description: `Personal and executive PSYCH-K® sessions with ${
              facilitator?.name || "our expert facilitator"
            }`,
            provider: {
              "@type": "Organization",
              name: "SubMind Mastery",
              image: facilitator?.image_url || undefined,
            },
            serviceType: "Personal Development Services",
            offers: {
              "@type": "Offer",
              price: "5000",
              priceCurrency: "INR",
            },
          })}
        </script>
      </Helmet>

      <Navbar />

      <main className="flex-1">
        <Hero
          title="Book Your Transformation Session"
          subtitle={`Begin your journey to mastering your subconscious mind with ${
            facilitator?.name || "our"
          } personalized PSYCH-K facilitation`}
          centered
          gradient
        />

        <section className="py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="personal" className="mb-16">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="personal">Personal Sessions</TabsTrigger>
                  <TabsTrigger value="executive">
                    Executive Sessions
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="personal" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">
                      Personal Transformation Sessions
                    </h2>
                    <p className="text-muted-foreground">
                      Personal PSYCH-K sessions focus on identifying and
                      transforming the limiting beliefs that are holding you
                      back in your personal life, relationships,
                      self-confidence, and overall well-being.
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Session Details</CardTitle>
                      <CardDescription>
                        Information about personal sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium">Duration</dt>
                          <dd className="text-sm text-muted-foreground">
                            90-120 minutes
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium">Format</dt>
                          <dd className="text-sm text-muted-foreground">
                            Online via secure video
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="executive" className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight mb-4">
                      Executive Coaching Sessions
                    </h2>
                    <p className="text-muted-foreground">
                      Executive PSYCH-K sessions are specifically designed for
                      business leaders and high-performing professionals who
                      want to overcome limiting beliefs affecting their
                      leadership, decision-making, and professional growth.
                    </p>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Executive Session Details</CardTitle>
                      <CardDescription>
                        Information about executive sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <dt className="text-sm font-medium">Duration</dt>
                          <dd className="text-sm text-muted-foreground">
                            2-3 hours initial session, 90 minutes follow-up
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium">Format</dt>
                          <dd className="text-sm text-muted-foreground">
                            Via confidential executive video platform
                          </dd>
                        </div>

                        <div>
                          <dt className="text-sm font-medium">
                            Executive Package
                          </dt>
                          <dd className="text-sm text-muted-foreground">
                            3-month transformation program available
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">
                  Request Your Session with{" "}
                  {facilitator?.name || "Our Facilitator"}
                </h2>
                <SessionForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Sessions;
