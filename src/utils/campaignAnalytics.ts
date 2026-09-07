import rawCampaignData from '../data/socialCampaignData.json';
import { CampaignPost } from '../types';

export interface CampaignMetrics {
  totalPosts: number;
  byVertical: { [key: string]: number };
  byChannel: { [key: string]: number };
  byMonth: { [key: string]: number };
  totalViews: number;
  totalReach: number;
  totalImpressions: number;
  averageCharacters: number;
  topPosts: CampaignPost[];
}

export function getAllCampaignPosts(): CampaignPost[] {
  const allPosts: CampaignPost[] = [];
  const data = rawCampaignData as Record<string, any[]>;

  for (const [month, posts] of Object.entries(data)) {
    if (Array.isArray(posts)) {
      for (const p of posts) {
        allPosts.push({
          Vertical: p.Vertical || 'Unknown',
          Channel: p.Channel || 'Facebook',
          Date: p.Date || '',
          Day: p.Day || '',
          Status: p.Status || 'LIVE',
          Caption: p.Caption || '',
          Character: p.Character || (p.Caption ? p.Caption.length : 0),
          PostLink: p['Post Link'] || p.PostLink || '',
          Views: typeof p.Views === 'number' ? p.Views : null,
          Reach: typeof p.Reach === 'number' ? p.Reach : null,
          Impression: typeof p.Impression === 'number' ? p.Impression : null,
          Engagement: typeof p.Engagement === 'number' ? p.Engagement : null,
          Month: month,
        });
      }
    }
  }

  return allPosts;
}

export function computeCampaignMetrics(posts: CampaignPost[]): CampaignMetrics {
  const byVertical: { [key: string]: number } = {};
  const byChannel: { [key: string]: number } = {};
  const byMonth: { [key: string]: number } = {};

  let totalViews = 0;
  let totalReach = 0;
  let totalImpressions = 0;
  let totalChars = 0;
  let charCountPosts = 0;

  for (const post of posts) {
    byVertical[post.Vertical] = (byVertical[post.Vertical] || 0) + 1;
    byChannel[post.Channel] = (byChannel[post.Channel] || 0) + 1;
    if (post.Month) {
      byMonth[post.Month] = (byMonth[post.Month] || 0) + 1;
    }

    if (post.Views) totalViews += post.Views;
    if (post.Reach) totalReach += post.Reach;
    if (post.Impression) totalImpressions += post.Impression;
    if (post.Character && post.Character > 0) {
      totalChars += post.Character;
      charCountPosts++;
    }
  }

  // Find top posts sorted by Views, then Reach, then Impressions
  const sorted = [...posts].sort((a, b) => {
    const metricA = (a.Views || 0) * 10 + (a.Reach || 0) * 5 + (a.Impression || 0);
    const metricB = (b.Views || 0) * 10 + (b.Reach || 0) * 5 + (b.Impression || 0);
    return metricB - metricA;
  });

  return {
    totalPosts: posts.length,
    byVertical,
    byChannel,
    byMonth,
    totalViews,
    totalReach,
    totalImpressions,
    averageCharacters: charCountPosts > 0 ? Math.round(totalChars / charCountPosts) : 0,
    topPosts: sorted.slice(0, 5),
  };
}
