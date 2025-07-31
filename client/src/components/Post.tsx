import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface PostProps {
  post: {
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
  };
}

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (isLiked) {
        return apiRequest("DELETE", `/api/posts/${post.id}/like`);
      } else {
        return apiRequest("POST", `/api/posts/${post.id}/like`);
      }
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      // Invalidate and refetch feed
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLike = () => {
    if (!currentUser) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to like posts",
        variant: "destructive",
      });
      return;
    }
    likeMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this vibe from ${getUserDisplayName()}`,
        text: post.caption,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this vibe with your friends",
      });
    }
  };

  const handleRemix = () => {
    toast({
      title: "Remix Feature",
      description: "Remix functionality coming soon!",
    });
  };

  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comments feature coming soon!",
    });
  };

  const getUserDisplayName = () => {
    if (post.user.firstName && post.user.lastName) {
      return `${post.user.firstName} ${post.user.lastName}`;
    }
    return post.user.username || "Unknown User";
  };

  const getTimeAgo = () => {
    const now = new Date();
    const postDate = new Date(post.createdAt);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return postDate.toLocaleDateString();
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: "😊",
      excited: "🔥",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      anxious: "😰",
      motivated: "💪",
      chill: "😎",
      funny: "😂",
      confused: "🤔",
      grateful: "🙏",
    };
    return emojiMap[emotion.toLowerCase()] || "🎭";
  };

  return (
    <Card className="bg-semi-dark mx-4 mb-4 rounded-2xl overflow-hidden border-gray-700">
      {/* Post Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
            {post.user.profileImageUrl ? (
              <img 
                src={post.user.profileImageUrl} 
                alt={`${post.user.username} avatar`} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-medium">
                {post.user.firstName?.[0] || post.user.username?.[0] || "?"}
              </div>
            )}
          </div>
          <div>
            <h4 className="font-semibold text-white text-sm">{getUserDisplayName()}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-400">
              <span>Feeling {post.detectedEmotion}</span>
              <span>•</span>
              <span>{getTimeAgo()}</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-gray-400 p-2">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Post Content */}
      <div className="relative">
        <img 
          src={post.mediaUrl} 
          alt="Generated content" 
          className="w-full aspect-square object-cover"
        />
        
        {/* Emotion Indicator */}
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
          <span className="text-lg">{getEmotionEmoji(post.detectedEmotion)}</span>
          <span className="text-white text-xs font-medium capitalize">{post.mood}</span>
        </div>
        
        {/* Caption Overlay */}
        {post.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <p className="text-white font-bold text-center">{post.caption}</p>
          </div>
        )}
      </div>
      
      {/* Post Actions */}
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={likeMutation.isPending}
              className={`flex items-center space-x-2 p-2 ${
                isLiked ? "text-secondary" : "text-gray-400 hover:text-secondary"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center space-x-2 text-gray-400 hover:text-white p-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{post.commentsCount}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemix}
              className="flex items-center space-x-2 text-gray-400 hover:text-neon-green p-2"
            >
              <Repeat2 className="w-5 h-5" />
              <span className="text-sm font-medium">Remix</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-400 hover:text-white p-2"
          >
            <Share className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Original Content Preview */}
        {post.content && (
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-300 italic">"{post.content}"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
