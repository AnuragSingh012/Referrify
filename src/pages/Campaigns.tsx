import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { PlusCircle, Link as LinkIcon, Users, Calendar, ChevronRight, Copy, Mail, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid, getReferralData } from "@/lib/utils";

// Define schema for campaign form
const campaignSchema = z.object({
  name: z.string().min(2, "Campaign name must be at least 2 characters"),
  discount: z.coerce.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  message: z.string().max(200, "Message must be less than 200 characters"),
});

type Campaign = z.infer<typeof campaignSchema> & { 
  id: string;
  referralLink: string;
  status: 'active' | 'draft' | 'completed';
  referrals: number;
  conversions: number;
  endsIn: number;
};

const CampaignCard = ({ 
  campaign,
  onCopyLink
}: { 
  campaign: Campaign;
  onCopyLink: (link: string) => void;
}) => {
  const referralData = getReferralData();
  const campaignStats = referralData[campaign.id] || { clicks: 0, conversions: 0, users: [] };
  
  // Update campaign stats from localStorage
  campaign.referrals = campaignStats.clicks || 0;
  campaign.conversions = campaignStats.conversions || 0;
  
  const statusStyles = {
    active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
  };
  
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{campaign.name}</CardTitle>
          <div className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[campaign.status]}`}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </div>
        </div>
        <CardDescription>{campaign.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center text-muted-foreground">
            <LinkIcon size={16} className="mr-2" />
            <span>{campaign.referrals} referrals</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Users size={16} className="mr-2" />
            <span>{campaign.conversions} conversions</span>
          </div>
          <div className="flex items-center text-muted-foreground">
            <Calendar size={16} className="mr-2" />
            <span>Ends in {campaign.endsIn} days</span>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium">Referral Link</p>
            <div className="flex items-center gap-2">
              <Input 
                value={campaign.referralLink} 
                readOnly 
                className="text-xs bg-background flex-1" 
              />
              <div className="flex gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onCopyLink(campaign.referralLink)}
                  title="Copy link"
                >
                  <Copy size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  title="Share via email"
                  onClick={() => {
                    window.open(`mailto:?subject=Check out this offer&body=Use this link to get a ${campaign.discount}% discount: ${campaign.referralLink}`, '_blank');
                  }}
                >
                  <Mail size={16} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  title="Share via SMS"
                  onClick={() => {
                    window.open(`sms:?body=Use this link to get a ${campaign.discount}% discount: ${campaign.referralLink}`, '_blank');
                  }}
                >
                  <Phone size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full justify-between">
          View Campaign Details
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyState = () => (
  <div className="text-center py-16 px-4">
    <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
      <PlusCircle size={36} />
    </div>
    <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      Create your first referral campaign to start growing your customer base through referrals.
    </p>
    <Button>Create Campaign</Button>
  </div>
);

const CampaignSetupSection = ({ onSubmit }: { onSubmit: (values: z.infer<typeof campaignSchema>) => void }) => {
  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: "",
      discount: undefined,
      message: ""
    }
  });

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>
          Set up a new referral campaign in just a few steps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Summer Referral Program" {...field} />
                  </FormControl>
                  <FormDescription>
                    Give your campaign a name that reflects its purpose.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g. 15" 
                      type="number" 
                      min="1" 
                      max="100" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Discount percentage that referred users will receive.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter a custom message for the referral page" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be displayed when users visit the referral link.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full sm:w-auto">
              Generate Referral Link
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  
  // Load campaigns from localStorage on component mount
  useEffect(() => {
    const storedCampaigns = localStorage.getItem('campaigns');
    if (storedCampaigns) {
      setCampaigns(JSON.parse(storedCampaigns));
    }
  }, []);
  
  // Save campaigns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);
  
  const handleCreateCampaign = (values: z.infer<typeof campaignSchema>) => {
    const id = nanoid();
    const hostname = window.location.origin;
    const newCampaign: Campaign = {
      ...values,
      id,
      status: 'active',
      referralLink: `${hostname}/referral?id=${id}`,
      referrals: 0,
      conversions: 0,
      endsIn: 30
    };
    
    setCampaigns([...campaigns, newCampaign]);
    toast.success("Campaign created", {
      description: "Your campaign has been created successfully!"
    });
  };
  
  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link)
      .then(() => {
        toast.success("Link copied", {
          description: "Referral link copied to clipboard"
        });
      })
      .catch(err => {
        toast.error("Failed to copy", {
          description: "Please try again or copy manually"
        });
        console.error('Failed to copy link: ', err);
      });
  };
  
  return (
    <PageLayout>
      <PageHeader 
        title="Campaigns" 
        description="Create and manage your referral campaigns"
      />
      
      <CampaignSetupSection onSubmit={handleCreateCampaign} />
      
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-medium">Your Campaigns</h2>
        <Button variant="outline" size="sm">
          <PlusCircle size={16} className="mr-2" />
          New Campaign
        </Button>
      </div>
      
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {campaigns.map(campaign => (
            <CampaignCard 
              key={campaign.id}
              campaign={campaign}
              onCopyLink={handleCopyLink}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </PageLayout>
  );
};

export default Campaigns;
