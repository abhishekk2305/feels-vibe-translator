import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flame, Coffee, Zap, Heart, Brain, Star } from "lucide-react";

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  prompt: string;
  gradient: string;
}

interface QuickActionsProps {
  onActionSelect: (prompt: string) => void;
}

export default function QuickActions({ onActionSelect }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: "mood-boost",
      icon: <Flame className="w-5 h-5" />,
      label: "Mood Boost",
      prompt: "I need some positive energy and motivation to get through today",
      gradient: "from-orange-400 to-red-500"
    },
    {
      id: "chill-vibe",
      icon: <Coffee className="w-5 h-5" />,
      label: "Chill Vibe",
      prompt: "I'm feeling relaxed and want to share some laid-back energy",
      gradient: "from-blue-400 to-cyan-500"
    },
    {
      id: "energy-burst",
      icon: <Zap className="w-5 h-5" />,
      label: "Energy Burst",
      prompt: "I'm super excited and energetic right now, let's make something epic!",
      gradient: "from-yellow-400 to-orange-500"
    },
    {
      id: "grateful",
      icon: <Heart className="w-5 h-5" />,
      label: "Grateful",
      prompt: "I'm feeling thankful and want to spread some love and appreciation",
      gradient: "from-pink-400 to-rose-500"
    },
    {
      id: "deep-thoughts",
      icon: <Brain className="w-5 h-5" />,
      label: "Deep Thoughts",
      prompt: "I'm in a contemplative mood and have some interesting thoughts to share",
      gradient: "from-purple-400 to-indigo-500"
    },
    {
      id: "celebration",
      icon: <Star className="w-5 h-5" />,
      label: "Celebration",
      prompt: "Something amazing happened and I want to celebrate and share the joy!",
      gradient: "from-green-400 to-emerald-500"
    }
  ];

  return (
    <Card className="glass-card">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">
          Quick Vibe Starters
        </h3>
        <p className="text-sm text-gray-400 text-center mb-6">
          Choose a vibe to get started instantly
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className={`
                p-4 h-auto flex flex-col items-center space-y-2 
                border-white/10 hover:border-white/30 
                bg-gradient-to-r ${action.gradient} bg-opacity-10
                hover:scale-105 transition-all duration-300
                text-white hover:text-white
              `}
              onClick={() => onActionSelect(action.prompt)}
            >
              <div className={`
                w-10 h-10 rounded-full bg-gradient-to-r ${action.gradient} 
                flex items-center justify-center
              `}>
                {action.icon}
              </div>
              <span className="text-sm font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Or type your own custom vibe above
          </p>
        </div>
      </CardContent>
    </Card>
  );
}