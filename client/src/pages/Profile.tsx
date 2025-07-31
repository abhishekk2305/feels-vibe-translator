import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Grid, Repeat, Heart } from "lucide-react";
import { useLocation, useParams } from "wouter";

interface UserProfile {
  id: string;
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  profileImageUrl?: string;
  stats: {
    posts: number;
    followers: number;
    following: number;
    vibeScore: number;
  };
}

interface UserPost {
  id: string;
  mediaUrl: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const profileUserId = userId || (currentUser as any)?.id;
  const isOwnProfile = !userId || userId === (currentUser as any)?.id;

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/users", profileUserId],
    enabled: !!profileUserId,
  });

  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["/api/posts/user", profileUserId],
    enabled: !!profileUserId,
  });

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <Button onClick={() => setLocation("/")} variant="outline">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const userProfile = profile as UserProfile;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-sm mx-auto">
        {/* Header Navigation Only */}
        <div className="relative">
          <div className="flex justify-between items-center p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="p-2"
              style={{ color: 'hsl(262, 83%, 58%)' }}
            >
              <ArrowLeft className="w-4 h-4" style={{ color: 'hsl(262, 83%, 58%)' }} />
            </Button>
            {isOwnProfile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/settings")}
                className="p-2"
                style={{ color: 'hsl(262, 83%, 58%)' }}
              >
                <Settings className="w-4 h-4" style={{ color: 'hsl(262, 83%, 58%)' }} />
              </Button>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            {/* Profile Picture and Button Section */}
            <div className="relative mb-4 h-20">
              {/* Profile Picture - left side */}
              <div className="absolute left-0 bottom-0 w-20 h-20 rounded-full border-4 border-dark-bg overflow-hidden bg-gray-700">
                {userProfile.profileImageUrl ? (
                  <img 
                    src={userProfile.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    {userProfile.firstName?.[0] || userProfile.username?.[0] || "?"}
                  </div>
                )}
              </div>
              
              {/* Edit Profile Button - right side */}
              <div className="absolute right-0 bottom-2">
                {isOwnProfile ? (
                  <Button className="gradient-bg text-white px-4 py-2 rounded-xl font-semibold text-sm">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button className="gradient-bg text-white px-4 py-2 rounded-xl font-semibold">
                      Follow
                    </Button>
                    <Button variant="outline" className="px-4 py-2 rounded-xl">
                      Message
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-bold mb-1">
                {userProfile.firstName && userProfile.lastName 
                  ? `${userProfile.firstName} ${userProfile.lastName}`
                  : userProfile.username || "Unknown User"
                }
              </h2>
              <p className="mb-2" style={{ color: 'hsl(262, 83%, 58%)' }}>@{userProfile.username || "unknown"}</p>
              {userProfile.bio && (
                <p className="text-sm" style={{ color: 'hsl(262, 83%, 58%)' }}>{userProfile.bio}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-xl font-bold">{userProfile.stats.posts}</div>
                <div className="text-xs" style={{ color: 'hsl(262, 83%, 58%)' }}>Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{userProfile.stats.followers}</div>
                <div className="text-xs" style={{ color: 'hsl(262, 83%, 58%)' }}>Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{userProfile.stats.following}</div>
                <div className="text-xs" style={{ color: 'hsl(262, 83%, 58%)' }}>Following</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold gradient-text">{userProfile.stats.vibeScore}</div>
                <div className="text-xs" style={{ color: 'hsl(262, 83%, 58%)' }}>Vibe Score</div>
              </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg">
                <TabsTrigger 
                  value="posts" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
                  style={{ color: 'hsl(262, 83%, 58%)' }}
                >
                  <Grid className="w-4 h-4" />
                  <span>Posts</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="remixes" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
                  style={{ color: 'hsl(262, 83%, 58%)' }}
                >
                  <Repeat className="w-4 h-4" />
                  <span>Remixes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="liked" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
                  style={{ color: 'hsl(262, 83%, 58%)' }}
                >
                  <Heart className="w-4 h-4" />
                  <span>Liked</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-4">
                {postsLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : (posts as any[]).length > 0 ? (
                  <div className="grid grid-cols-3 gap-1">
                    {(posts as any[]).map((post: any) => (
                      <div key={post.id} className="aspect-square relative group cursor-pointer">
                        <img 
                          src={post.mediaUrl} 
                          alt="Post" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <div className="flex items-center space-x-4 text-white text-sm">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likesCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                              </svg>
                              <span>{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <Grid className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-gray-400 text-sm">
                      {isOwnProfile ? "Share your first vibe!" : "No posts to show"}
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="remixes" className="mt-4">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Repeat className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No remixes yet</h3>
                  <p className="text-gray-400 text-sm">Remixed content will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="liked" className="mt-4">
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No liked posts yet</h3>
                  <p className="text-gray-400 text-sm">Liked posts will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
