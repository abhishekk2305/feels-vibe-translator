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
          {/* Analytics Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-purple-600 dark:text-purple-400 font-poppins">1,234</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Vibes</div>
              </div>
              <div>
                <div className="text-xl font-bold text-pink-600 dark:text-pink-400 font-poppins">47</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Today</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400 font-poppins">Happy</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Top Mood</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-4 border border-gray-200 dark:border-border shadow-sm card-hover">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-medium text-sm">S</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base font-poppins" style={{ color: '#8B5CF6' }}>sarah_vibes</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">2h ago • excited</p>
              </div>
              <button className="text-purple-500 hover:text-purple-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
                </svg>
              </button>
            </div>
            
            <p className="text-base mb-2 font-medium" style={{ color: '#6B21A8' }}>feeling absolutely amazing today! ✨</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">AI turned my happiness into this magical moment</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                  <span className="text-sm">❤️</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">42</span>
                </button>
                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                  <span className="text-sm">💬</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">8</span>
                </button>
              </div>
              <button className="hover:scale-110 transition-transform">
                <span className="text-sm">📤</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-card rounded-xl p-4 border border-gray-200 dark:border-border shadow-sm card-hover">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ 
                backgroundColor: '#8B5CF6'
              }}>
                <span className="text-white font-medium text-sm">M</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base font-poppins" style={{ color: '#8B5CF6' }}>mike_creates</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">1h ago • hyped</p>
              </div>
              <button className="text-purple-500 hover:text-purple-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/>
                </svg>
              </button>
            </div>
            
            <p className="text-base mb-2 font-medium" style={{ color: '#6B21A8' }}>when the weekend hits different 🚀</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-3">AI created the perfect weekend vibe</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                  <span className="text-sm">❤️</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">67</span>
                </button>
                <button className="flex items-center space-x-1 hover:scale-110 transition-transform">
                  <span className="text-sm">💬</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">12</span>
                </button>
              </div>
              <button className="hover:scale-110 transition-transform">
                <span className="text-sm">📤</span>
              </button>
            </div>
          </div>

          {/* App Info Footer */}
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-xs space-y-2">
            <div className="flex items-center justify-center space-x-4">
              <a href="mailto:feedback@feels.app" className="hover:text-purple-500 transition-colors">
                Report Bug
              </a>
              <span>•</span>
              <span>Beta v1.0</span>
              <span>•</span>
              <a href="#" className="hover:text-purple-500 transition-colors">
                Privacy
              </a>
            </div>
            <div className="text-gray-400 dark:text-gray-500">
              Powered by OpenAI & feels✨ team
            </div>
          </div>
        </div>
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </div>
  );
}
