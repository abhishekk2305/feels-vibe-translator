import { useQuery } from "@tanstack/react-query";
import Post from "./Post";

interface FeedPost {
  id: string;
  content: string;
  mediaUrl: string;
  caption: string;
  detectedEmotion: string;
  mood: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

export default function Feed() {
  // Mock posts for demonstration - in real app this would come from API
  const mockPosts = [
    {
      id: "1",
      content: "feeling absolutely amazing today! ✨",
      mediaUrl: "",
      caption: "AI turned my happiness into this magical moment",
      detectedEmotion: "joy",
      mood: "excited",
      likesCount: 42,
      commentsCount: 8,
      isLiked: false,
      createdAt: "2025-07-31T20:00:00Z",
      user: {
        id: "user1",
        username: "sarah_vibes",
        firstName: "Sarah",
        lastName: "Chen",
        profileImageUrl: ""
      }
    },
    {
      id: "2", 
      content: "when the weekend hits different 🚀",
      mediaUrl: "",
      caption: "AI created the perfect weekend vibe",
      detectedEmotion: "excitement",
      mood: "hyped",
      likesCount: 67,
      commentsCount: 12,
      isLiked: true,
      createdAt: "2025-07-31T19:30:00Z",
      user: {
        id: "user2",
        username: "mike_creates",
        firstName: "Mike",
        lastName: "Johnson", 
        profileImageUrl: ""
      }
    }
  ];

  // Use mock posts directly for now since API requires authentication
  const posts = mockPosts;
  const isLoading = false;
  const error = null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-t-transparent rounded-full" style={{ borderColor: 'hsl(262, 83%, 58%)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ 
          background: 'linear-gradient(135deg, hsl(262, 40%, 20%) 0%, hsl(324, 40%, 20%) 100%)',
          border: '1px solid hsl(262, 50%, 40%)'
        }}>
          <span className="text-2xl">😔</span>
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'hsl(262, 70%, 85%)' }}>Something went wrong</h3>
        <p className="text-sm text-center" style={{ color: 'hsl(262, 60%, 55%)' }}>
          Failed to load your feed. Please try again.
        </p>
      </div>
    );
  }

  if ((posts as any[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 min-h-[400px]">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ 
          background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(324, 93%, 68%) 100%)',
          boxShadow: '0 10px 25px hsla(262, 83%, 58%, 0.3)'
        }}>
          <span className="text-3xl">🎭</span>
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ color: 'hsl(262, 83%, 58%)' }}>your feed is empty</h3>
        <p className="text-base text-center mb-8 max-w-xs leading-relaxed" style={{ color: 'hsl(262, 70%, 45%)' }}>
          follow other creators or create your first vibe to see content here! ✨
        </p>
        <div className="w-full max-w-xs">
          <button 
            onClick={() => window.location.href = '/create'}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{ 
              background: 'linear-gradient(135deg, hsl(262, 83%, 58%) 0%, hsl(324, 93%, 68%) 100%)',
              boxShadow: '0 4px 15px hsla(262, 83%, 58%, 0.3)'
            }}
          >
            create your first vibe ✨
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4">
      {/* STATIC VISIBLE POSTS - FORCING VISIBILITY */}
      <div className="mb-6 p-6 rounded-2xl border-2" style={{ 
        backgroundColor: '#FFFFFF',
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

      <div className="mb-6 p-6 rounded-2xl border-2" style={{ 
        backgroundColor: '#FFFFFF',
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
  );
}
