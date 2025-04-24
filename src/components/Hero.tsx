
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HeroProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
  centered?: boolean;
  gradient?: boolean;
}

const Hero = ({
  title,
  subtitle,
  children,
  image,
  imageAlt = "Hero image",
  className,
  centered = false,
  gradient = false,
}: HeroProps) => {
  return (
    <section className={cn(
      "relative py-20 overflow-hidden",
      gradient && "bg-gradient-to-br from-background via-secondary/40 to-background",
      className
    )}>
      <div className="container relative z-10">
        <div className={cn(
          "max-w-3xl",
          centered && "mx-auto text-center"
        )}>
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight",
            gradient && "text-gradient"
          )}>
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              {subtitle}
            </p>
          )}
          
          {children}
        </div>
      </div>
      
      {image && (
        <div className="absolute inset-0 z-0 opacity-10">
          <img
            src={image}
            alt={imageAlt}
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}
    </section>
  );
};

export default Hero;
