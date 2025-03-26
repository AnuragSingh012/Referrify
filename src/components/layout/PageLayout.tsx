import React from "react";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  className, 
  fullWidth = false 
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main 
        className={cn(
          "flex-1 pt-20", 
          fullWidth ? "w-full" : "container mx-auto px-4 md:px-6",
          className
        )}
      >
        <div className="animate-scale-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export const PageHeader = ({ 
  title, 
  description,
  className
}: { 
  title: string; 
  description?: string;
  className?: string;
}) => {
  return (
    <div className={cn("mb-8 mt-6", className)}>
      <div className="inline-flex items-center gap-2">
        <div className="h-1 w-6 bg-primary rounded-full" />
        <h1 className="text-3xl font-display font-semibold tracking-tight">
          {title}
        </h1>
      </div>
      {description && (
        <p className="text-muted-foreground mt-2 max-w-3xl">
          {description}
        </p>
      )}
    </div>
  );
};
