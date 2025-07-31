import { Button } from "@/components/ui/button";
import { Home, Search, Plus, Heart, User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleTabClick = (tab: string, path: string) => {
    onTabChange(tab);
    setLocation(path);
  };

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      path: "/",
    },
    {
      id: "discover",
      label: "Discover",
      icon: Search,
      path: "/discover",
    },
    {
      id: "create",
      label: "Create",
      icon: Plus,
      path: "/create",
      isSpecial: true,
    },
    {
      id: "activity",
      label: "Activity",
      icon: Heart,
      path: "/activity",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-card border-t border-border z-50">
      <div className="flex items-center justify-around py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <Button
                key={item.id}
                onClick={() => handleTabClick(item.id, item.path)}
                className="bg-gradient-to-r from-primary to-secondary p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
              >
                <Icon className="w-6 h-6 text-white" />
              </Button>
            );
          }

          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => handleTabClick(item.id, item.path)}
              className="flex flex-col items-center space-y-1 p-2 min-w-0 hover:bg-transparent"
              style={{ color: 'hsl(262, 83%, 58%)' }}
            >
              <Icon className="w-5 h-5" style={{ color: 'hsl(262, 83%, 58%)' }} />
              <span className="text-xs font-medium">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
