
import { Link } from "react-router-dom";
import { Brain, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Store the email subscription in the database
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);
        
      if (error) throw new Error(error.message);
      
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="bg-gradient-to-b from-primary/5 to-primary/10 py-14 mt-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Brain className="size-8 text-primary" strokeWidth={2.5} />
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-primary">Mastering Subconscious</span>
                <span className="text-xs font-medium text-muted-foreground -mt-1">Transform Your Mind</span>
              </div>
            </div>
            <p className="text-sm text-foreground/80 font-medium max-w-xs">
              Transforming lives through mastering the subconscious mind and PSYCH-K facilitation.
            </p>
            
            <form onSubmit={handleSubscribe} className="mt-6 space-y-2">
              <label htmlFor="footer-email" className="text-sm font-bold">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  id="footer-email"
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 px-3 py-2 text-sm rounded-md border border-border bg-background/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button type="submit" variant="default" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Subscribe"}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Explore Links */}
          <div className="flex flex-col">
            <h3 className="font-extrabold mb-6 text-foreground uppercase tracking-wide text-lg">Explore</h3>
            <ul className="space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "PSYCH-K", path: "/psych-k" },
                { name: "Business Benefits", path: "/business-benefits" }
              ].map((link) => (
                <li key={link.path} className="group">
                  <Link to={link.path} className="text-sm font-bold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* About Links */}
          <div className="flex flex-col">
            <h3 className="font-extrabold mb-6 text-foreground uppercase tracking-wide text-lg">About</h3>
            <ul className="space-y-4">
              {[
                { name: "N.L BHATTARAI", path: "/facilitator" },
                { name: "Sessions", path: "/sessions" },
                { name: "Recent Updates", path: "/blog" }
              ].map((link) => (
                <li key={link.path} className="group">
                  <Link to={link.path} className="text-sm font-bold flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-background to-muted/50 p-5 rounded-lg shadow-md border border-border/50">
            <h3 className="font-extrabold mb-5 text-foreground uppercase tracking-wide text-lg">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 group">
                <MapPin className="size-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold text-foreground/80">Mumbai, India</span>
              </li>
              <li className="flex items-start gap-3 group">
                <Mail className="size-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform mt-0.5" />
                <a href="mailto:contact@submindmastery.com" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors break-all">
                  contact@submindmastery.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="size-5 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+123456789" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
                  +1 (234) 567-89
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-border text-center">
          <p className="font-medium text-sm text-muted-foreground">© {new Date().getFullYear()} Mastering Subconscious. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
