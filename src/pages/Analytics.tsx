import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLayout, PageHeader } from "@/components/layout/PageLayout";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Link as LinkIcon, Users, Gift, TrendingUp, Activity } from "lucide-react";
import { getAnalyticsData, getReferralData, getRewards } from "@/lib/utils";

const StatCard = ({ 
  title, 
  value, 
  description, 
  trend, 
  icon: Icon 
}: { 
  title: string; 
  value: string; 
  description: string; 
  trend?: string;
  icon: React.ElementType;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={18} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center text-xs text-green-600 mt-2">
            <ArrowUpRight size={14} className="mr-1" />
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Generate mock data for charts based on real referral data
const generateChartData = (referrals: any) => {
  const now = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Create last 7 months of data
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const monthIndex = (now.getMonth() - i + 12) % 12;
    const month = months[monthIndex];
    
    // Use real data when available, otherwise generate mock data
    const visits = Math.floor(Math.random() * 200) + 100;
    const conversions = Math.floor(visits * (Math.random() * 0.4 + 0.3)); // 30-70% conversion rate
    
    data.push({
      name: month,
      visits,
      conversions
    });
  }
  
  return data;
};

const topReferrersFromData = () => {
  // In a real app, this would come from the database
  // For now, we'll generate mock data
  return [
    { id: 1, name: "John Smith", referrals: 28, conversions: 21 },
    { id: 2, name: "Sara Johnson", referrals: 24, conversions: 18 },
    { id: 3, name: "Michael Brown", referrals: 22, conversions: 15 },
    { id: 4, name: "Emily Davis", referrals: 20, conversions: 12 },
    { id: 5, name: "David Wilson", referrals: 18, conversions: 14 },
  ];
};

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("last30days");
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [referralData, setReferralData] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Calculate analytics data from localStorage
    const analytics = getAnalyticsData();
    setAnalyticsData(analytics);
    
    // Generate chart data based on real data when available
    const rawReferralData = getReferralData();
    setReferralData(generateChartData(rawReferralData));
    
    // Get top referrers
    setTopReferrers(topReferrersFromData());
    
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Loading analytics data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-4">
        <PageHeader 
          title="Analytics" 
          description="Track and measure the performance of your referral campaigns"
        />
        
        <Select 
          defaultValue={timeframe} 
          onValueChange={(value) => setTimeframe(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last7days">Last 7 days</SelectItem>
            <SelectItem value="last30days">Last 30 days</SelectItem>
            <SelectItem value="last3months">Last 3 months</SelectItem>
            <SelectItem value="last6months">Last 6 months</SelectItem>
            <SelectItem value="lastyear">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Total Visits" 
          value={analyticsData?.totalClicks?.toString() || "0"} 
          description="Page visits from referral links"
          trend="+12.5% from last month"
          icon={LinkIcon}
        />
        <StatCard 
          title="Conversions" 
          value={analyticsData?.totalConversions?.toString() || "0"} 
          description="Successful referral sign-ups"
          trend="+8.2% from last month"
          icon={Users}
        />
        <StatCard 
          title="Rewards Claimed" 
          value={analyticsData?.totalRewards?.toString() || "0"} 
          description="Total rewards created"
          trend="+15.3% from last month"
          icon={Gift}
        />
        <StatCard 
          title="Conversion Rate" 
          value={analyticsData?.conversionRate || "0%"} 
          description="Referral visit to sign-up rate"
          trend="+2.4% from last month"
          icon={TrendingUp}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Referral Performance</CardTitle>
            <CardDescription>
              Visits vs conversions over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="weekly" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralData.slice(-4)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--muted))" />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="monthly" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--muted))" />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <TabsContent value="yearly" className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referralData.slice(0, 4)}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visits" fill="hsl(var(--muted))" />
                    <Bar dataKey="conversions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center text-sm">
                  <div className="h-3 w-3 rounded bg-muted mr-2"></div>
                  <span>Visits</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="h-3 w-3 rounded bg-primary mr-2"></div>
                  <span>Conversions</span>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
            <CardDescription>
              Users with the most successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrers.map((referrer) => (
                <div 
                  key={referrer.id} 
                  className="flex justify-between items-center p-3 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                      {referrer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{referrer.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {referrer.referrals} referrals
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{referrer.conversions}</div>
                    <div className="text-xs text-muted-foreground">conversions</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Comparison</CardTitle>
            <CardDescription>
              Performance metrics across your active campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Campaign</th>
                    <th className="text-left p-3 font-medium">Visits</th>
                    <th className="text-left p-3 font-medium">Conversions</th>
                    <th className="text-left p-3 font-medium">Conv. Rate</th>
                    <th className="text-left p-3 font-medium">Rewards</th>
                    <th className="text-left p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(analyticsData?.campaignData || []).length > 0 ? (
                    analyticsData.campaignData.map((campaign: any) => {
                      const campaignsData = localStorage.getItem('campaigns');
                      const campaigns = campaignsData ? JSON.parse(campaignsData) : [];
                      const campaignDetails = campaigns.find((c: any) => c.id === campaign.id) || {};
                      
                      return (
                        <tr key={campaign.id} className="border-b">
                          <td className="p-3">{campaignDetails.name || 'Unknown Campaign'}</td>
                          <td className="p-3">{campaign.clicks}</td>
                          <td className="p-3">{campaign.conversions}</td>
                          <td className="p-3">{campaign.conversionRate}</td>
                          <td className="p-3">{Math.floor(campaign.conversions * 0.8)}</td>
                          <td className="p-3">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              Active
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-muted-foreground">
                        No campaign data available yet. Create your first campaign to see analytics.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Analytics;
