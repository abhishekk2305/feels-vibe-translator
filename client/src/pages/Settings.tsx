import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, LogOut, Moon, Bell, Shield, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import type { User } from "@shared/schema";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user } = useAuth() as { user: User | null };
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            className="text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-9"></div> {/* Spacer for center alignment */}
        </div>

        <div className="px-4 space-y-6">
          {/* User Profile Section */}
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-semibold text-white">
                      {user?.firstName?.[0] || user?.email?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || "User"
                    }
                  </p>
                  <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">App Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-400">Get notified about new vibes</p>
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-400">Always on for better vibes</p>
                  </div>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-white">Privacy & Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-white/10 p-3 h-auto"
              >
                <Shield className="w-5 h-5 mr-3 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium">Privacy Settings</p>
                  <p className="text-sm text-gray-400">Control who can see your content</p>
                </div>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-white hover:bg-white/10 p-3 h-auto"
              >
                <HelpCircle className="w-5 h-5 mr-3 text-gray-400" />
                <div className="text-left">
                  <p className="font-medium">Help & Support</p>
                  <p className="text-sm text-gray-400">Get help or report an issue</p>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* App Info */}
          <Card className="glass-card border-white/10">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold gradient-text">Feels</h3>
                <p className="text-sm text-gray-400">Version 1.0.0</p>
                <p className="text-xs text-gray-500">Transform your vibes into viral content</p>
              </div>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="glass-card border-red-500/20 bg-red-500/5">
            <CardContent className="p-4">
              {!showLogoutConfirm ? (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full justify-start text-red-400 hover:bg-red-500/10 p-3 h-auto"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm text-gray-400">Sign out of your account</p>
                  </div>
                </Button>
              ) : (
                <div className="space-y-3">
                  <p className="text-white font-medium text-center">Are you sure you want to sign out?</p>
                  <div className="flex space-x-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bottom Spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}