import { Button } from "@/components/ui/button";
import { Bell, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function TopHeader() {
  const [, setLocation] = useLocation();

  const handleNotifications = () => {
    setLocation("/activity");
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-card sticky top-0 z-40">
      <div className="flex items-center">
        <h1 className="text-xl font-bold font-poppins" style={{ color: 'hsl(262, 83%, 58%)' }}>feels✨</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNotifications}
          className="p-2 relative hover:bg-accent"
          style={{ color: 'hsl(262, 83%, 58%)' }}
        >
          <Bell className="w-4 h-4" style={{ color: 'hsl(262, 83%, 58%)' }} />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full"></div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/messages")}
          className="p-2 hover:bg-accent"
          style={{ color: 'hsl(262, 83%, 58%)' }}
        >
          <MessageCircle className="w-4 h-4" style={{ color: 'hsl(262, 83%, 58%)' }} />
        </Button>
      </div>
    </div>
  );
}
