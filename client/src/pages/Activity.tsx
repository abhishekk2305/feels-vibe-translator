import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useLocation } from "wouter";

export default function Activity() {
  const [, setLocation] = useLocation();

  // Mock notification data - in a real app this would come from an API
  const notifications = [
    {
      id: "1",
      type: "like",
      user: { username: "sarah_vibe", profileImageUrl: null },
      content: "liked your vibe",
      time: "2m ago",
      isRead: false
    },
    {
      id: "2", 
      type: "comment",
      user: { username: "alex_feels", profileImageUrl: null },
      content: "commented on your post",
      time: "5m ago",
      isRead: false
    },
    {
      id: "3",
      type: "follow",
      user: { username: "vibe_master", profileImageUrl: null },
      content: "started following you",
      time: "1h ago",
      isRead: true
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-red-400" />;
      case "comment":
        return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-400" />;
      default:
        return <Heart className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-card sticky top-0 z-40">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-primary p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">Activity</h1>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No notifications yet</h3>
              <p className="text-gray-400 text-sm text-center">
                When people interact with your vibes, you'll see it here!
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <Card key={notification.id} className={`bg-semi-dark border-gray-700 ${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {notification.user.profileImageUrl ? (
                        <img 
                          src={notification.user.profileImageUrl} 
                          alt={notification.user.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {notification.user.username[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white">
                          {notification.user.username}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {notification.content}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">
                        {notification.time}
                      </p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}