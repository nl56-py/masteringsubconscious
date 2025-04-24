
import { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, Menu, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { text: "Home", to: "/" },
  { text: "PSYCH-K", to: "/psych-k" },
  { text: "Business Benefits", to: "/business-benefits" },
  { text: "Facilitator", to: "/facilitator" },
  { text: "Sessions", to: "/sessions" },
  { text: "Recent Updates", to: "/blog", icon: FileText },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur shadow-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
          <Brain className="size-9 text-primary" strokeWidth={2.5} />
          <div className="flex flex-col items-start">
            <span className="font-extrabold text-xl text-primary tracking-tight">Mastering Subconscious</span>
            <span className="text-xs font-medium text-muted-foreground -mt-1">Transform Your Mind</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 ml-auto mr-6">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="nav-link text-sm font-bold tracking-wide uppercase hover:text-primary transition-colors px-1 py-2"
            >
              {link.text}
            </Link>
          ))}
        </nav>
        
        {/* Book a Session Button */}
        <div className="hidden md:block">
          <Button asChild variant="default" size="sm" className="font-bold shadow-sm hover:shadow-md transition-all hover:scale-105">
            <Link to="/sessions">Book a Session</Link>
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground"
          >
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "container md:hidden overflow-hidden transition-all",
        isMenuOpen ? "max-h-[400px] py-4" : "max-h-0"
      )}>
        <nav className="flex flex-col gap-2 bg-muted/50 p-4 rounded-lg shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-foreground/80 hover:text-primary py-3 font-semibold tracking-wide text-center uppercase border-b border-border/60 last:border-0"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.text}
            </Link>
          ))}
          <Button asChild className="mt-3 font-bold">
            <Link to="/sessions" onClick={() => setIsMenuOpen(false)}>Book a Session</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
