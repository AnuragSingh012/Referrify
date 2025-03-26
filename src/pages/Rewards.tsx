import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { Gift, Copy, CheckCircle, Share2, ExternalLink, Ticket } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn, getRewards, redeemReward } from "@/lib/utils";
import { toast } from "sonner";

type Reward = {
  id: string;
  title: string;
  code: string;
  description: string;
  expiryDate: string;
  isRedeemed: boolean;
  campaignId: string;
  type: 'referred' | 'referrer';
  redeemedAt?: string;
};

const RewardCard = ({
  reward,
  onRedeem,
  onCopyCode
}: {
  reward: Reward;
  onRedeem: (id: string) => void;
  onCopyCode: (code: string) => void;
}) => {
  return (
    <Card className={cn(
      "transition-all hover:shadow-md border-l-4",
      reward.isRedeemed ? "border-l-muted" : "border-l-primary"
    )}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className={reward.isRedeemed ? "text-muted-foreground" : ""}>{reward.title}</CardTitle>
          {reward.isRedeemed ? (
            <div className="flex items-center text-muted-foreground text-sm">
              <CheckCircle size={16} className="mr-2" />
              Redeemed
            </div>
          ) : (
            <div className="flex items-center text-green-600 text-sm">
              <Ticket size={16} className="mr-2" />
              Available
            </div>
          )}
        </div>
        <CardDescription>{reward.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-secondary rounded-lg p-3 flex justify-between items-center mb-4">
          <code className="font-mono text-sm font-medium">{reward.code}</code>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            disabled={reward.isRedeemed}
            onClick={() => onCopyCode(reward.code)}
          >
            <Copy size={14} />
            <span className="sr-only">Copy code</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Expires: {reward.expiryDate}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          disabled={reward.isRedeemed}
          onClick={() => onRedeem(reward.id)}
        >
          {reward.isRedeemed ? "Redeemed" : "Redeem Now"}
          <ExternalLink size={14} className="ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const ReferralProgressCard = () => {
  const [referralStats, setReferralStats] = useState({
    referrals: 0,
    earned: 0,
    available: 0
  });
  
  useEffect(() => {
    // In a real app, this data would come from an API
    // For now, we'll use mock data with a slight delay to simulate loading
    setTimeout(() => {
      const rewards = getRewards();
      
      setReferralStats({
        referrals: 2, // Mock data
        earned: 30, // Mock data in dollars
        available: rewards.filter((r: Reward) => !r.isRedeemed).length
      });
    }, 500);
  }, []);
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Referral Progress</CardTitle>
        <CardDescription>
          Refer more friends to unlock additional rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">{referralStats.referrals} successful referrals</span>
              <span className="text-muted-foreground">5 needed for next tier</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-2/5"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 rounded-lg bg-secondary/70">
              <div className="text-2xl font-semibold">{referralStats.referrals}</div>
              <div className="text-xs text-muted-foreground">Referred</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/70">
              <div className="text-2xl font-semibold">${referralStats.earned}</div>
              <div className="text-xs text-muted-foreground">Earned</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/70">
              <div className="text-2xl font-semibold">{referralStats.available}</div>
              <div className="text-xs text-muted-foreground">Available</div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gap-2">
          <Share2 size={16} />
          Share Referral Link
        </Button>
      </CardFooter>
    </Card>
  );
};

const Rewards = () => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load rewards from localStorage
    const loadedRewards = getRewards();
    setRewards(loadedRewards);
    setLoading(false);
  }, []);
  
  const handleRedeemReward = (id: string) => {
    if (redeemReward(id)) {
      setRewards(rewards.map(r => 
        r.id === id ? { ...r, isRedeemed: true, redeemedAt: new Date().toISOString() } : r
      ));
      
      toast.success("Reward redeemed", {
        description: "Your reward has been successfully redeemed"
      });
    }
  };
  
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code copied", {
          description: "Reward code copied to clipboard"
        });
      })
      .catch(err => {
        toast.error("Failed to copy", {
          description: "Please try again or copy manually"
        });
        console.error('Failed to copy code: ', err);
      });
  };
  
  const availableRewards = rewards.filter(r => !r.isRedeemed);
  const redeemedRewards = rewards.filter(r => r.isRedeemed);
  
  return (
    <PageLayout>
      <PageHeader 
        title="Rewards" 
        description="Track and redeem rewards earned from your referrals"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-pulse text-center">
                <p className="text-muted-foreground">Loading rewards...</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="available" className="mb-8">
              <TabsList className="mb-4">
                <TabsTrigger value="available">Available ({availableRewards.length})</TabsTrigger>
                <TabsTrigger value="redeemed">Redeemed ({redeemedRewards.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="space-y-6">
                {availableRewards.length > 0 ? (
                  availableRewards.map(reward => (
                    <RewardCard 
                      key={reward.id}
                      reward={reward}
                      onRedeem={handleRedeemReward}
                      onCopyCode={handleCopyCode}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Gift size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No rewards available</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-6">
                      You don't have any available rewards yet. Refer friends to earn rewards!
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/campaigns">Go to Campaigns</a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="redeemed" className="space-y-6">
                {redeemedRewards.length > 0 ? (
                  redeemedRewards.map(reward => (
                    <RewardCard 
                      key={reward.id}
                      reward={reward}
                      onRedeem={handleRedeemReward}
                      onCopyCode={handleCopyCode}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={24} className="text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No redeemed rewards</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      You haven't redeemed any rewards yet.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
        
        <div>
          <ReferralProgressCard />
          
          <Card>
            <CardHeader>
              <CardTitle>Your Referral Link</CardTitle>
              <CardDescription>
                Share this link with friends to earn rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary rounded-lg p-3 flex justify-between items-center mb-4">
                <code className="font-mono text-xs truncate">
                  {window.location.origin}/referral?id=default
                </code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => handleCopyCode(`${window.location.origin}/referral?id=default`)}
                >
                  <Copy size={14} />
                  <span className="sr-only">Copy link</span>
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button variant="outline" className="w-full gap-2">
                <Share2 size={16} />
                Share via Social Media
              </Button>
              <Button 
                variant="ghost" 
                className="w-full gap-2"
                onClick={() => window.open(`/referral?id=default`, '_blank')}
              >
                <ExternalLink size={16} />
                View Referral Page
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Rewards;
