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
        <div className="pb-20 px-4 space-y-3">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-medium text-sm">S</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base" style={{ color: '#8B5CF6' }}>sarah_vibes</h4>
                <p className="text-xs text-gray-500">2h ago • excited</p>
              </div>
            </div>
            
            <p className="text-base mb-2" style={{ color: '#6B21A8' }}>feeling absolutely amazing today! ✨</p>
            <p className="text-sm text-gray-600 italic mb-3">AI turned my happiness into this magical moment</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1">
                  <span className="text-sm">❤️</span>
                  <span className="text-sm font-medium text-gray-700">42</span>
                </button>
                <button className="flex items-center space-x-1">
                  <span className="text-sm">💬</span>
                  <span className="text-sm font-medium text-gray-700">8</span>
                </button>
              </div>
              <button>
                <span className="text-sm">📤</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-medium text-sm">M</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base" style={{ color: '#8B5CF6' }}>mike_creates</h4>
                <p className="text-xs text-gray-500">1h ago • hyped</p>
              </div>
            </div>
            
            <p className="text-base mb-2" style={{ color: '#6B21A8' }}>when the weekend hits different 🚀</p>
            <p className="text-sm text-gray-600 italic mb-3">AI created the perfect weekend vibe</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1">
                  <span className="text-sm">❤️</span>
                  <span className="text-sm font-medium text-gray-700">67</span>
                </button>
                <button className="flex items-center space-x-1">
                  <span className="text-sm">💬</span>
                  <span className="text-sm font-medium text-gray-700">12</span>
                </button>
              </div>
              <button>
                <span className="text-sm">📤</span>
              </button>
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
