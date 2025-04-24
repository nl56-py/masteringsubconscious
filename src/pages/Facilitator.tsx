import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Database } from "@/integrations/supabase/types";
import Hero from "@/components/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Award,
  BookOpen,
  Users,
  PenTool,
  Globe,
  Calendar,
  MapPin,
  Quote,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FacilitatorRow = Database["public"]["Tables"]["facilitator"]["Row"];

interface FacilitatorData {
  id: string;
  name: string;
  image_url: string | null;
}

const Facilitator = () => {
  const [facilitator, setFacilitator] = useState<FacilitatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilitator = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("facilitator")
          .select("id, name, image_url")
          .limit(1)
          .single();

        if (error) throw error;
        setFacilitator(data as FacilitatorData);
      } catch (err: any) {
        console.error("Error fetching facilitator:", err);
        setError(err.message || "Failed to load facilitator information");
      } finally {
        setLoading(false);
      }
    };

    fetchFacilitator();
  }, []);

  // Generate facilitator bio sections based on the name
  const generateBio = (name: string) => {
    return {
      intro: `${name} is a certified PSYCH-K® facilitator dedicated to helping individuals and business executives transform their lives through subconscious reprogramming. With a passion for personal growth and transformation, ${name} guides clients to identify and change limiting beliefs that may be holding them back from reaching their full potential.`,

      background: `With certification completed in Mumbai, ${name} brings a unique perspective to the practice of PSYCH-K®, blending Eastern philosophical insights with Western psychological approaches. This balanced methodology creates a comprehensive framework for addressing both personal and professional challenges.`,

      approach: `${name}'s approach is client-centered and results-oriented, focusing on creating a safe space for transformation while empowering clients with tools they can use long after their sessions. By facilitating rather than directing the process, ${name} ensures that each client's journey is authentic and personally meaningful.`,

      journey: `${name}'s personal journey with PSYCH-K® began after experiencing firsthand the limitations that subconscious beliefs can place on one's life and potential. After discovering the profound impact that belief change can have, ${name} became passionate about sharing these transformative techniques with others who are seeking meaningful change in their lives.`,

      philosophy: `At the core of ${name}'s practice is the understanding that our beliefs shape our reality at every level – from our personal relationships to our professional success. By addressing the root causes of limitation at the subconscious level, clients can experience rapid and sustainable transformation in areas where they previously felt stuck or blocked.`,

      specialties: [
        "Executive Coaching",
        "Stress Management",
        "Personal Transformation",
        "Relationship Harmony",
        "Career Development",
        "Overcoming Limiting Beliefs",
      ],

      testimonialQuote:
        "Working with " +
        name +
        " was a turning point in my life. In just a few sessions, I was able to identify and change beliefs that had been holding me back for decades. The results were immediate and profound.",

      testimonialAuthor: "Executive Client",

      credentials: [
        "Certified PSYCH-K® Facilitator",
        "Master Hypnosis ",
        "Professional Development Program",
        "Experience 5+ Years",
      ],
    };
  };

  const facilitatorBio = facilitator
    ? generateBio(facilitator.name)
    : generateBio("Our Facilitator");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <Hero
        title={facilitator?.name || "Your PSYCH-K Facilitator"}
        subtitle="Guiding You Through Transformational Subconscious Reprogramming"
        gradient
        centered
      />

      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : facilitator ? (
          <div className="space-y-12">
            <div className="bg-white shadow-md rounded-xl overflow-hidden md:flex">
              <div className="md:w-1/3 h-[400px]">
                <img
                  src={facilitator.image_url || "/placeholder.svg"}
                  alt={facilitator.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 md:w-2/3 space-y-4">
                <h2 className="text-3xl font-bold mb-2">{facilitator.name}</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    Certified PSYCH-K® Facilitator
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/10">
                    Executive Coach
                  </Badge>
                  <Badge variant="outline" className="bg-accent/10">
                    Subconscious Reprogramming
                  </Badge>
                </div>
                <div className="prose max-w-none">
                  <p>{facilitatorBio.intro}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Background & Training
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {facilitatorBio.background}
                  </p>
                  <div className="pt-2">
                    <ul className="space-y-2">
                      {facilitatorBio.credentials.map((credential, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>{credential}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <PenTool className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold">
                      Approach & Philosophy
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    {facilitatorBio.approach}
                  </p>
                  <div className="pt-2">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>Client-centered facilitation</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>
                          Integration of Eastern and Western approaches
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        <span>Results-focused methodology</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Quote className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Personal Journey</h3>
                </div>
                <p className="text-muted-foreground">
                  {facilitatorBio.journey}
                </p>
                <p className="text-muted-foreground mt-4">
                  {facilitatorBio.philosophy}
                </p>

                <div className="bg-secondary/10 p-4 rounded-lg border border-border mt-4">
                  <p className="italic text-muted-foreground">
                    "{facilitatorBio.testimonialQuote}"
                  </p>
                  <p className="text-right font-medium mt-2">
                    — {facilitatorBio.testimonialAuthor}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Areas of Specialization
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {facilitatorBio.specialties.map((specialty, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 p-4 rounded-lg border border-border"
                    >
                      <h4 className="font-medium">{specialty}</h4>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    What Makes {facilitator.name} Unique
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Holistic Perspective</h4>
                        <p className="text-sm text-muted-foreground">
                          Integrates both Eastern and Western approaches to
                          create comprehensive solutions
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Individual Attention</h4>
                        <p className="text-sm text-muted-foreground">
                          Each session is tailored to the unique needs and goals
                          of the client
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Location Options</h4>
                        <p className="text-sm text-muted-foreground">
                          Offers virtual sessions for maximum convenience
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button size="lg" asChild>
                <Link to="/sessions">
                  Book a Session with {facilitator.name}
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Facilitator information will be available soon.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Facilitator;
