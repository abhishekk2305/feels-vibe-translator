import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, LogOut, Moon, Bell, Shield, HelpCircle, Sun } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import type { User } from "@shared/schema";

export default function Settings() {
  const [, setLocation] = useLocation();
  const { user } = useAuth() as { user: User | null };
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            className="text-foreground p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Settings</h1>
          <div className="w-8"></div>
        </div>

        <div className="px-4 space-y-4">
          {/* User Profile Section */}
          <Card className="bg-card border-border">
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {user?.firstName?.[0] || user?.email?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-card-foreground truncate">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || "User"
                    }
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Options */}
          <Card className="bg-card border-border">
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground font-medium text-sm">Notifications</p>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {theme === "dark" ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                  <p className="text-foreground font-medium text-sm">
                    {theme === "dark" ? "Dark Mode" : "Light Mode"}
                  </p>
                </div>
                <Switch 
                  checked={theme === "dark"} 
                  onCheckedChange={toggleTheme}
                />
              </div>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-foreground hover:bg-accent p-2 h-auto"
              >
                <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                <p className="font-medium text-sm">Privacy Settings</p>
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-foreground hover:bg-accent p-2 h-auto"
              >
                <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                <p className="font-medium text-sm">Help & Support</p>
              </Button>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="glass-card border-red-500/20 bg-red-500/5">
            <CardContent className="p-3">
              {!showLogoutConfirm ? (
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full justify-start text-red-400 hover:bg-red-500/10 p-2 h-auto"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  <p className="font-medium text-sm">Sign Out</p>
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-white font-medium text-center text-sm">Sign out of your account?</p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setShowLogoutConfirm(false)}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-sm py-2"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleLogout}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm py-2"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* App Info - Compact */}
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">feels✨ v1.0.0</p>
          </div>

          {/* Bottom Spacing */}
          <div className="h-20"></div>
        </div>
      </div>
    </div>
  );
}