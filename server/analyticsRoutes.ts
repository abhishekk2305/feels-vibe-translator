import type { Express } from "express";

interface AnalyticsData {
  totalVibes: number;
  todayVibes: number;
  topMood: string;
  copyClicks: number;
  mostUsedPreset: string;
}

// Simple in-memory analytics (for demo purposes)
let analytics: AnalyticsData = {
  totalVibes: 1234,
  todayVibes: 47,
  topMood: "Happy",
  copyClicks: 89,
  mostUsedPreset: "excited"
};

export function setupAnalytics(app: Express) {
  // Get analytics stats
  app.get("/api/analytics/stats", (req, res) => {
    res.json(analytics);
  });

  // Track vibe creation
  app.post("/api/analytics/track-vibe", (req, res) => {
    const { preset, mood } = req.body;
    analytics.totalVibes++;
    analytics.todayVibes++;
    
    // Simple logic to update most used preset and top mood
    if (preset) {
      analytics.mostUsedPreset = preset;
    }
    if (mood) {
      analytics.topMood = mood;
    }
    
    res.json({ success: true });
  });

  // Track copy button clicks
  app.post("/api/analytics/track-copy", (req, res) => {
    analytics.copyClicks++;
    res.json({ success: true });
  });

  // Reset daily stats (would be a cron job in production)
  app.post("/api/analytics/reset-daily", (req, res) => {
    analytics.todayVibes = 0;
    res.json({ success: true });
  });
}