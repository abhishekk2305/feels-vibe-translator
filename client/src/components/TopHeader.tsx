import { Button } from "@/components/ui/button";
import { Bell, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function TopHeader() {
  const [, setLocation] = useLocation();

  return (
    <div className="flex items-center justify-between p-4 pt-8 bg-semi-dark sticky top-0 z-40">
      <div className="flex items-center space-x-3">
        <h1 className="text-2xl font-bold gradient-text font-poppins">Feels</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white p-2 relative"
        >
          <Bell className="w-5 h-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/messages")}
          className="text-white p-2"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
