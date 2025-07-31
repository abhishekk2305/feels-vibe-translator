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
        <div className="pb-20 px-4">
          <div className="mb-6 p-6 rounded-2xl border-2 bg-white" style={{ 
            borderColor: '#8B5CF6',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)'
          }}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h4 className="font-bold text-lg" style={{ color: '#8B5CF6' }}>sarah_vibes</h4>
                <p className="text-sm" style={{ color: '#A855F7' }}>2h ago • excited</p>
              </div>
            </div>
            
            <p className="text-lg mb-4 font-medium" style={{ color: '#6B21A8' }}>feeling absolutely amazing today! ✨</p>
            <p className="text-base mb-4 italic" style={{ color: '#A855F7' }}>AI turned my happiness into this magical moment</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2" style={{ color: '#EC4899' }}>
                  <span className="text-xl">❤️</span>
                  <span className="text-base font-semibold">42</span>
                </button>
                <button className="flex items-center space-x-2" style={{ color: '#A855F7' }}>
                  <span className="text-xl">💬</span>
                  <span className="text-base font-semibold">8</span>
                </button>
              </div>
              <button style={{ color: '#A855F7' }}>
                <span className="text-xl">📤</span>
              </button>
            </div>
          </div>

          <div className="mb-6 p-6 rounded-2xl border-2 bg-white" style={{ 
            borderColor: '#8B5CF6',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.15)'
          }}>
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mr-4" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h4 className="font-bold text-lg" style={{ color: '#8B5CF6' }}>mike_creates</h4>
                <p className="text-sm" style={{ color: '#A855F7' }}>1h ago • hyped</p>
              </div>
            </div>
            
            <p className="text-lg mb-4 font-medium" style={{ color: '#6B21A8' }}>when the weekend hits different 🚀</p>
            <p className="text-base mb-4 italic" style={{ color: '#A855F7' }}>AI created the perfect weekend vibe</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="flex items-center space-x-2" style={{ color: '#EC4899' }}>
                  <span className="text-xl">❤️</span>
                  <span className="text-base font-semibold">67</span>
                </button>
                <button className="flex items-center space-x-2" style={{ color: '#A855F7' }}>
                  <span className="text-xl">💬</span>
                  <span className="text-base font-semibold">12</span>
                </button>
              </div>
              <button style={{ color: '#A855F7' }}>
                <span className="text-xl">📤</span>
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
