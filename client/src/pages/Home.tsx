import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import Stories from "@/components/Stories";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(180deg, hsl(240, 21%, 9%) 0%, hsl(237, 22%, 15%) 100%)',
      color: 'hsl(262, 70%, 85%)'
    }}>
      <div className="max-w-sm mx-auto relative">
        <TopHeader />
        <Stories />
        <Feed />
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
