import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Search, Edit } from "lucide-react";
import { useLocation } from "wouter";

interface Conversation {
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
  };
  unreadCount: number;
}

export default function Messages() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations"],
  });

  const filteredConversations = (conversations as any[]).filter((conv: any) =>
    conv.user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const getUserDisplayName = (user: Conversation['user']) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.username || "Unknown User";
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 bg-semi-dark">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Messages</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white p-2"
          >
            <Edit className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="pb-20">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : filteredConversations.length > 0 ? (
            <div className="space-y-1">
              {filteredConversations.map((conversation: Conversation) => (
                <div
                  key={conversation.user.id}
                  className="flex items-center space-x-3 p-4 hover:bg-semi-dark cursor-pointer transition-colors"
                  onClick={() => {
                    // TODO: Navigate to individual conversation
                    console.log("Open conversation with", conversation.user.username);
                  }}
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-700 overflow-hidden flex-shrink-0">
                      {conversation.user.profileImageUrl ? (
                        <img 
                          src={conversation.user.profileImageUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-medium">
                          {conversation.user.firstName?.[0] || conversation.user.username?.[0] || "?"}
                        </div>
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Message Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white truncate">
                        {getUserDisplayName(conversation.user)}
                      </h4>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">No messages yet</h3>
              <p className="text-gray-400 text-sm text-center mb-6">
                {searchQuery 
                  ? "No conversations match your search"
                  : "Start a conversation by sharing your vibes with friends!"
                }
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setLocation("/create")}
                  className="gradient-bg text-white px-6 py-2 rounded-xl font-semibold"
                >
                  Create Your First Vibe
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
