import { useState } from "react";
import TopHeader from "@/components/TopHeader";
import Stories from "@/components/Stories";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen" style={{ 
      background: '#000000',
      color: '#FFFFFF'
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
