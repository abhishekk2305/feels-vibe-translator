import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import Stories from "@/components/Stories";
import FeedTest from "@/components/FeedTest";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, hsl(0, 0%, 98%) 0%, hsl(220, 13%, 95%) 100%)',
      color: 'hsl(262, 70%, 45%)'
    }}>
      <div className="max-w-sm mx-auto relative">
        <TopHeader />
        <Stories />
        <FeedTest />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
