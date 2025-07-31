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
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["/api/posts/feed"],
    refetchInterval: 30000, // Refresh feed every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">😔</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">Something went wrong</h3>
        <p className="text-gray-400 text-sm text-center">
          Failed to load your feed. Please try again.
        </p>
      </div>
    );
  }

  if ((posts as any[]).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl">🎭</span>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-white">Your feed is empty</h3>
        <p className="text-gray-400 text-sm text-center mb-6">
          Follow other creators or create your first vibe to see content here!
        </p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {(posts as any[]).map((post: any) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
}
