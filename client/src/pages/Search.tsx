import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search as SearchIcon, User, Hash, Grid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface User {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

interface Post {
  id: string;
  content: string;
  mediaUrl?: string;
  user: User;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  // Search users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users/search", { q: searchQuery }],
    enabled: searchQuery.length > 0 && activeTab === "users",
  });

  // Search posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts/search", { q: searchQuery }],
    enabled: searchQuery.length > 0 && activeTab === "posts",
  });

  // Search hashtags
  const { data: hashtags = [], isLoading: hashtagsLoading } = useQuery({
    queryKey: ["/api/hashtags/search", { q: searchQuery }],
    enabled: searchQuery.length > 0 && activeTab === "hashtags",
  });

  const getUserDisplayName = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || "Unknown User";
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return `${Math.floor(diffInHours / 24)}d`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center p-4 pt-8 bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2 mr-2"
            style={{ color: 'hsl(262, 83%, 58%)' }}
          >
            <ArrowLeft className="w-5 h-5" style={{ color: 'hsl(262, 83%, 58%)' }} />
          </Button>
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search users, posts, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground pl-10 rounded-xl"
              autoFocus
            />
          </div>
        </div>

        {/* Search Results */}
        {searchQuery.length > 0 && (
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg mb-4">
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white flex items-center space-x-2 text-muted-foreground"
                >
                  <User className="w-4 h-4" />
                  <span>Users</span>
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white flex items-center space-x-2 text-muted-foreground"
                >
                  <Grid className="w-4 h-4" />
                  <span>Posts</span>
                </TabsTrigger>
                <TabsTrigger
                  value="hashtags"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-400 data-[state=active]:to-pink-400 data-[state=active]:text-white flex items-center space-x-2 text-muted-foreground"
                >
                  <Hash className="w-4 h-4" />
                  <span>Tags</span>
                </TabsTrigger>
              </TabsList>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-2">
                {usersLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Searching users...
                  </div>
                ) : (users as User[]).length > 0 ? (
                  (users as User[]).map((user: User) => (
                    <div
                      key={user.id}
                      onClick={() => setLocation(`/profile/${user.id}`)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                        {user.profileImageUrl ? (
                          <img
                            src={user.profileImageUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">
                            {user.firstName?.[0] || user.username?.[0] || "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">
                          {getUserDisplayName(user)}
                        </h3>
                        <p className="text-muted-foreground text-sm truncate">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found for "{searchQuery}"
                  </div>
                )}
              </TabsContent>

              {/* Posts Tab */}
              <TabsContent value="posts" className="space-y-4">
                {postsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Searching posts...
                  </div>
                ) : (posts as Post[]).length > 0 ? (
                  (posts as Post[]).map((post: Post) => (
                    <div key={post.id} className="bg-card rounded-lg p-4 border">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                          {post.user.profileImageUrl ? (
                            <img
                              src={post.user.profileImageUrl}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm">
                              {post.user.firstName?.[0] || post.user.username?.[0] || "?"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">
                            {getUserDisplayName(post.user)}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {formatTime(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm mb-3">{post.content}</p>
                      {post.mediaUrl && (
                        <img
                          src={post.mediaUrl}
                          alt="Post content"
                          className="w-full rounded-lg mb-3"
                        />
                      )}
                      <div className="flex items-center space-x-4 text-muted-foreground text-xs">
                        <span>{post.stats.likes} likes</span>
                        <span>{post.stats.comments} comments</span>
                        <span>{post.stats.shares} shares</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No posts found for "{searchQuery}"
                  </div>
                )}
              </TabsContent>

              {/* Hashtags Tab */}
              <TabsContent value="hashtags" className="space-y-2">
                {hashtagsLoading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Searching hashtags...
                  </div>
                ) : (hashtags as any[]).length > 0 ? (
                  (hashtags as any[]).map((hashtag: any) => (
                    <div
                      key={hashtag.tag}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                          <Hash className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">#{hashtag.tag}</h3>
                          <p className="text-muted-foreground text-sm">
                            {hashtag.count} posts
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hashtags found for "{searchQuery}"
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Popular/Trending when no search */}
        {searchQuery.length === 0 && (
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Trending</h2>
            <div className="space-y-2">
              {["#vibecheck", "#feels", "#mood", "#aesthetic", "#genZ"].map((tag) => (
                <div
                  key={tag}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{tag}</h3>
                    <p className="text-muted-foreground text-sm">Trending</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}