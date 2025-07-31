import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import Stories from "@/components/Stories";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Home() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("home");

  const handleCreateVibe = () => {
    setLocation("/create");
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto relative">
        <TopHeader />
        
        {/* Vibe Creator Prompt */}
        <div className="p-4">
          <Card className="glass-card bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30 hover:scale-[1.02] transition-transform duration-300">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                  <span className="text-xl">🎭</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">what's ur vibe rn? 💭</h3>
                  <p className="text-sm text-gray-300">express urself, get instant viral content</p>
                </div>
                <Button 
                  onClick={handleCreateVibe}
                  size="sm"
                  className="gradient-bg text-white rounded-full px-6 py-2 font-semibold hover:scale-105 transition-transform"
                >
                  ✨ vibe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Stories />
        <Feed />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
