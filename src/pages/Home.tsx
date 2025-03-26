import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { ArrowRight, Zap, Users, Award, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="p-6 rounded-xl bg-white border border-border shadow-sm transition-all hover:shadow-md">
    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Home = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center bg-secondary text-secondary-foreground text-sm px-4 py-1.5 rounded-full mb-6 animate-fade-in">
            <Zap size={14} className="mr-2" />
            Simplified Referral Campaigns
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight tracking-tight mb-6 animate-blur-in">
            Drive Growth Through <span className="text-primary">Customer Referrals</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-in-right">
            Create, manage, and track powerful referral campaigns that turn your customers into brand advocates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full px-8 animate-scale-in">
              <Link to="/campaigns">
                Create Campaign
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="rounded-full px-8 animate-scale-in delay-100"
            >
              <Link to="/rewards">
                View Rewards
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies the process of creating and managing referral campaigns
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Zap}
              title="Easy Campaign Setup"
              description="Create customized referral campaigns in minutes with our intuitive campaign builder."
            />
            <FeatureCard 
              icon={Users}
              title="Referral Generation"
              description="Generate unique referral links for your customers to share with their networks."
            />
            <FeatureCard 
              icon={Award}
              title="Reward Distribution"
              description="Automatically track and distribute rewards to successful referrers."
            />
            <FeatureCard 
              icon={BarChart}
              title="Performance Analytics"
              description="Monitor campaign performance with real-time analytics and insights."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4">
          <div className={cn(
            "rounded-2xl p-8 md:p-12 relative overflow-hidden",
            "bg-gradient-to-br from-primary/90 to-primary text-white"
          )}>
            <div className="max-w-2xl relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to amplify your growth?
              </h2>
              <p className="text-white/85 text-lg mb-8">
                Start creating referral campaigns today and turn your customers into your best marketing channel.
              </p>
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8">
                <Link to="/campaigns">
                  Get Started
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
            {/* Background decorative elements */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute top-12 right-12 w-32 h-32 rounded-full bg-white/5 blur-xl"></div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Home;
