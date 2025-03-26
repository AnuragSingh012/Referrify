import React, { useEffect, useState } from "react";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { Gift, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";
import { saveReferral, saveReward, saveUserInfo } from "@/lib/utils";

// This would be replaced by actual data from a backend in a real app
type Campaign = {
  id: string;
  name: string;
  discount: number;
  message: string;
};

const Referral = () => {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Simulate fetching campaign data
  useEffect(() => {
    // In a real app, this would be an API call to get campaign details
    if (campaignId) {
      // Track the click
      saveReferral(campaignId, { converted: false });
      
      // Simulated API delay
      const timer = setTimeout(() => {
        // Get campaigns from localStorage
        const campaignsData = localStorage.getItem('campaigns');
        
        if (campaignsData) {
          const campaigns = JSON.parse(campaignsData);
          const foundCampaign = campaigns.find((c: Campaign) => c.id === campaignId);
          
          if (foundCampaign) {
            setCampaign(foundCampaign);
          }
        }
        
        // If no campaign was found, we'll handle that in the rendering logic
        setLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setLoading(false);
    }
  }, [campaignId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!campaignId || !campaign) return;
    
    // Save user email
    saveUserInfo(email);
    
    // Track the conversion
    saveReferral(campaignId, { email, converted: true });
    
    // Create rewards for both the referrer and the referred
    if (email) {
      // Reward for the referred user (the current user)
      const userReward = saveReward({
        title: `${campaign.discount}% Discount`,
        description: `${campaign.discount}% off your next purchase`,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days from now
        campaignId,
        type: 'referred'
      });
      
      // Reward for the referrer would also be created here
      // In a real app, we would identify the referrer and create their reward
      
      toast.success("Discount claimed!", {
        description: "Check your rewards page to use your discount",
      });
      
      setSubmitted(true);
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading referral details...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!campaignId || !campaign) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto text-center py-16">
          <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mb-6 mx-auto">
            <Gift size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Invalid Referral Link</h2>
          <p className="text-muted-foreground mb-8">
            This referral link is invalid or has expired. Please contact the person who shared this link with you for a new one.
          </p>
          <Button asChild>
            <a href="/">Go to Homepage</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  if (submitted) {
    return (
      <PageLayout>
        <div className="max-w-md mx-auto text-center py-16">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center text-green-500 mb-6 mx-auto">
            <Check size={32} />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Discount Claimed!</h2>
          <p className="text-muted-foreground mb-8">
            Your {campaign.discount}% discount has been added to your rewards. Thank you for joining through a referral!
          </p>
          <Button asChild>
            <a href="/rewards">View Your Rewards</a>
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader 
        title="You've Been Referred!" 
        description="Complete the form to claim your special offer"
      />

      <div className="max-w-md mx-auto mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Special Offer</CardTitle>
            <CardDescription>{campaign.message}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Your friend has invited you to get</p>
              <p className="text-3xl font-bold text-primary">{campaign.discount}% OFF</p>
              <p className="text-sm text-muted-foreground mt-1">your first purchase</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Your Email
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button type="submit" className="w-full">
                  Claim Your Discount
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex-col items-start pt-0">
            <p className="text-xs text-muted-foreground mt-4">
              By claiming this offer, you agree to our Terms of Service and Privacy Policy. 
              This offer is valid for new customers only.
            </p>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Referral;
