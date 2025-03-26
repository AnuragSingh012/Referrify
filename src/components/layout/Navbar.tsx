import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Gift, BarChart3, Home, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const NavItem = ({ 
  to, 
  label, 
  icon: Icon, 
  isActive 
}: { 
  to: string; 
  label: string; 
  icon: React.ElementType; 
  isActive: boolean;
}) => {
  return (
    <Link to={to}>
      <Button
        variant="ghost"
        className={cn(
          "flex items-center gap-2 px-4 py-6 transition-all duration-300",
          isActive 
            ? "text-primary font-medium" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon size={20} className={cn(isActive ? "text-primary" : "text-muted-foreground")} />
        <span>{label}</span>
        {isActive && (
          <div className="absolute -bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
        )}
      </Button>
    </Link>
  );
};

export const Navbar = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Campaigns", path: "/campaigns", icon: LayoutGrid },
    { label: "Rewards", path: "/rewards", icon: Gift },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ];
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm border-b" : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
              R
            </div>
            <span className="font-display font-semibold text-xl">Referrify</span>
          </Link>
          <Badge 
            variant="outline" 
            className="hidden md:flex font-normal py-1 ml-2 animate-fade-in"
          >
            Beta
          </Badge>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.path)}
            />
          ))}
        </nav>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          className="md:hidden" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 top-16 bg-background/95 backdrop-blur-md z-40 animate-fade-in">
          <nav className="flex flex-col items-start p-6 space-y-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="flex items-center gap-3 w-full p-2"
              >
                <item.icon 
                  size={22} 
                  className={cn(
                    "transition-colors",
                    isActive(item.path) 
                      ? "text-primary" 
                      : "text-muted-foreground"
                  )} 
                />
                <span 
                  className={cn(
                    "font-medium text-lg",
                    isActive(item.path) 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
