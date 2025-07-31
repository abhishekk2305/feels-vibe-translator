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
        <div style={{ padding: '20px', backgroundColor: '#FFFFFF', margin: '20px', border: '5px solid #FF0000' }}>
          <h1 style={{ color: '#FF0000', fontSize: '30px', fontWeight: 'bold' }}>
            EMERGENCY TEST - CAN YOU SEE THIS RED TEXT?
          </h1>
          <div style={{ 
            backgroundColor: '#8B5CF6',
            color: '#FFFFFF',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>POST FROM SARAH</h2>
            <p style={{ fontSize: '18px' }}>feeling absolutely amazing today! ✨</p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>❤️ 42 likes | 💬 8 comments</p>
          </div>
          <div style={{ 
            backgroundColor: '#EC4899',
            color: '#FFFFFF',
            padding: '20px',
            borderRadius: '10px',
            marginTop: '20px'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>POST FROM MIKE</h2>
            <p style={{ fontSize: '18px' }}>when the weekend hits different 🚀</p>
            <p style={{ fontSize: '16px', marginTop: '10px' }}>❤️ 67 likes | 💬 12 comments</p>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
