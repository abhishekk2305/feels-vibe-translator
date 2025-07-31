import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Brain, Heart } from "lucide-react";

interface AnalyzingAnimationProps {
  message?: string;
}

export default function AnalyzingAnimation({ 
  message = "Analyzing your vibe..." 
}: AnalyzingAnimationProps) {
  return (
    <Card className="glass-card">
      <CardContent className="p-8 text-center">
        {/* Main Animation */}
        <div className="relative mb-6">
          <div className="w-32 h-32 mx-auto relative">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-secondary/30 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            
            {/* Center brain icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center animate-pulse-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* Floating icons */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 animate-bounce" style={{ animationDelay: '0.5s' }}>
              <Zap className="w-6 h-6 text-blue-400" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '1s' }}>
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <div className="absolute top-1/2 -left-2 transform -translate-y-1/2 animate-bounce" style={{ animationDelay: '1.5s' }}>
              <Sparkles className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Text Animation */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold gradient-text animate-pulse">
            {message}
          </h3>
          
          {/* Progress indicators */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          {/* Status messages */}
          <div className="text-sm text-gray-400 space-y-2">
            <p className="animate-fade-in">🧠 Processing emotional patterns...</p>
            <p className="animate-fade-in" style={{ animationDelay: '0.5s' }}>✨ Generating creative insights...</p>
            <p className="animate-fade-in" style={{ animationDelay: '1s' }}>🎨 Crafting your perfect vibe...</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}