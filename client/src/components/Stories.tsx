import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLocation } from "wouter";

interface Story {
  id: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  mediaUrl: string;
  createdAt: string;
}

export default function Stories() {
  const [, setLocation] = useLocation();

  const { data: stories = [] } = useQuery({
    queryKey: ["/api/stories"],
  });

  const handleCreateStory = () => {
    setLocation("/create");
  };

  return (
    <div className="bg-semi-dark px-4 py-3 border-b border-gray-700">
      <div className="flex space-x-3 overflow-x-auto hide-scrollbar pb-2">
        {/* Add Story Button */}
        <div className="flex-shrink-0 text-center">
          <Button
            onClick={handleCreateStory}
            className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mb-2 p-0 hover:scale-105 transition-transform"
          >
            <Plus className="w-6 h-6 text-white" />
          </Button>
          <span className="text-xs text-gray-400">Your Story</span>
        </div>
        
        {/* Story Items */}
        {(stories as any[]).map((story: any) => (
          <div key={story.id} className="flex-shrink-0 text-center">
            <div className="story-ring rounded-full p-0.5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                {story.user.profileImageUrl ? (
                  <img 
                    src={story.user.profileImageUrl} 
                    alt={`${story.user.username} story`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-medium text-white">
                    {story.user.username?.[0] || "?"}
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 mt-1 block truncate w-16">
              {story.user.username}
            </span>
          </div>
        ))}

        {/* Show placeholder stories if none exist */}
        {(stories as any[]).length === 0 && (
          <>
            <div className="flex-shrink-0 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-2 flex items-center justify-center">
                <span className="text-lg">😊</span>
              </div>
              <span className="text-xs text-gray-500">sarah_vibe</span>
            </div>
            <div className="flex-shrink-0 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-2 flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
              <span className="text-xs text-gray-500">mike_remix</span>
            </div>
            <div className="flex-shrink-0 text-center opacity-50">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-2 flex items-center justify-center">
                <span className="text-lg">🚀</span>
              </div>
              <span className="text-xs text-gray-500">luna_art</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
