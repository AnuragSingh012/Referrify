import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Simple unique ID generator function
export function nanoid() {
  return Math.random().toString(36).substring(2, 10);
}

// Local storage helpers for our referral system
export const storageKeys = {
  referrals: "referrify-referrals",
  rewards: "referrify-rewards",
  userInfo: "referrify-user-info",
}

// Save referral data to localStorage
export function saveReferral(campaignId: string, referralData: any) {
  try {
    const storedData = localStorage.getItem(storageKeys.referrals) || "{}";
    const referrals = JSON.parse(storedData);
    
    // If campaign doesn't exist yet, initialize it
    if (!referrals[campaignId]) {
      referrals[campaignId] = {
        clicks: 0,
        conversions: 0,
        users: []
      };
    }
    
    // Update campaign data
    referrals[campaignId].clicks += 1;
    
    if (referralData.converted) {
      referrals[campaignId].conversions += 1;
      referrals[campaignId].users.push({
        email: referralData.email,
        date: new Date().toISOString(),
      });
    }
    
    localStorage.setItem(storageKeys.referrals, JSON.stringify(referrals));
    return true;
  } catch (error) {
    console.error("Error saving referral:", error);
    return false;
  }
}

// Get all referral data
export function getReferralData() {
  try {
    const storedData = localStorage.getItem(storageKeys.referrals) || "{}";
    return JSON.parse(storedData);
  } catch (error) {
    console.error("Error getting referral data:", error);
    return {};
  }
}

// Save user reward to localStorage
export function saveReward(rewardData: any) {
  try {
    const storedRewards = localStorage.getItem(storageKeys.rewards) || "[]";
    const rewards = JSON.parse(storedRewards);
    
    // Add the new reward with a unique ID
    const newReward = {
      id: nanoid(),
      code: `REWARD${Math.floor(Math.random() * 10000)}`,
      ...rewardData,
      createdAt: new Date().toISOString(),
      isRedeemed: false
    };
    
    rewards.push(newReward);
    localStorage.setItem(storageKeys.rewards, JSON.stringify(rewards));
    
    return newReward;
  } catch (error) {
    console.error("Error saving reward:", error);
    return null;
  }
}

// Get all rewards
export function getRewards() {
  try {
    const storedRewards = localStorage.getItem(storageKeys.rewards) || "[]";
    return JSON.parse(storedRewards);
  } catch (error) {
    console.error("Error getting rewards:", error);
    return [];
  }
}

// Mark a reward as redeemed
export function redeemReward(rewardId: string) {
  try {
    const storedRewards = localStorage.getItem(storageKeys.rewards) || "[]";
    const rewards = JSON.parse(storedRewards);
    
    const updatedRewards = rewards.map((reward: any) => {
      if (reward.id === rewardId) {
        return { ...reward, isRedeemed: true, redeemedAt: new Date().toISOString() };
      }
      return reward;
    });
    
    localStorage.setItem(storageKeys.rewards, JSON.stringify(updatedRewards));
    return true;
  } catch (error) {
    console.error("Error redeeming reward:", error);
    return false;
  }
}

// Save user info to localStorage
export function saveUserInfo(email: string) {
  try {
    localStorage.setItem(storageKeys.userInfo, JSON.stringify({ email }));
    return true;
  } catch (error) {
    console.error("Error saving user info:", error);
    return false;
  }
}

// Get user info
export function getUserInfo() {
  try {
    const storedInfo = localStorage.getItem(storageKeys.userInfo);
    return storedInfo ? JSON.parse(storedInfo) : null;
  } catch (error) {
    console.error("Error getting user info:", error);
    return null;
  }
}

// Calculate analytics data
export function getAnalyticsData() {
  const referrals = getReferralData();
  
  let totalClicks = 0;
  let totalConversions = 0;
  let campaignData = [];
  
  for (const [campaignId, data] of Object.entries(referrals)) {
    const campaignInfo = data as any;
    totalClicks += campaignInfo.clicks || 0;
    totalConversions += campaignInfo.conversions || 0;
    
    campaignData.push({
      id: campaignId,
      clicks: campaignInfo.clicks || 0,
      conversions: campaignInfo.conversions || 0,
      conversionRate: campaignInfo.clicks ? 
        ((campaignInfo.conversions / campaignInfo.clicks) * 100).toFixed(1) + '%' : 
        '0%'
    });
  }
  
  // Get rewards data
  const rewards = getRewards();
  const totalRewards = rewards.length;
  const redeemedRewards = rewards.filter((r: any) => r.isRedeemed).length;
  
  return {
    totalClicks,
    totalConversions,
    totalRewards,
    redeemedRewards,
    conversionRate: totalClicks ? 
      ((totalConversions / totalClicks) * 100).toFixed(1) + '%' : 
      '0%',
    campaignData
  };
}
