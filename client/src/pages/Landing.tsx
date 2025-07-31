import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();
  const [showDemo, setShowDemo] = useState(false);

  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  const startDemo = () => {
    setShowDemo(true);
    setTimeout(() => {
      setLocation("/onboarding");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-dark-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-blue/20 to-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="w-full max-w-sm mx-auto relative z-10">
        {/* App Icon */}
        <div className="text-center mb-8 animate-fade-scale">
          <div className="w-24 h-24 mx-auto glass-card rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
            <span className="text-4xl">🎭</span>
          </div>
          <h1 className="text-5xl font-bold gradient-text mb-4 font-black tracking-tight">Feels</h1>
          <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold mb-3 animate-bounce">
            ✨ UPDATED - JUL 31
          </div>
          <p className="text-xl text-white/90 mb-2 font-medium">Transform your vibes into viral content</p>
          <p className="text-sm text-white/75">AI-powered creativity at your fingertips</p>
        </div>

        {!showDemo ? (
          <div className="space-y-4 animate-slide-up">
            <Button 
              onClick={startDemo}
              className="w-full gradient-bg text-white hover:scale-105 transition-all duration-300 py-4 text-lg font-bold rounded-2xl shadow-2xl animate-pulse-glow"
            >
              ✨ Experience the Magic
            </Button>
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="w-full glass-card border-white/30 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 py-4 text-lg font-semibold rounded-2xl"
            >
              Sign In & Start Creating
            </Button>
          </div>
        ) : (
          <Card className="glass-card animate-fade-scale">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-gradient-to-r from-primary to-secondary"></div>
                <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <span className="text-white text-xl">🎨</span>
                </div>
              </div>
              <p className="text-white font-medium">Preparing your magical experience...</p>
            </CardContent>
          </Card>
        )}

        {/* Features Preview */}
        <div className="mt-12 space-y-3">
          <div className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <span className="text-sm">🎭</span>
              </div>
              <span className="font-semibold text-white">Emotion Detection</span>
            </div>
            <p className="text-sm text-white/75 ml-11">Express through text, voice, or photos</p>
          </div>
          
          <div className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-300 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-neon-green flex items-center justify-center">
                <span className="text-sm">🤖</span>
              </div>
              <span className="font-semibold text-white">AI Content Creation</span>
            </div>
            <p className="text-sm text-white/75">Instant viral content creation</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-4 border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🚀</span>
              <span className="font-medium text-white">Share Everywhere</span>
            </div>
            <p className="text-sm text-white/75">One-tap sharing to all platforms</p>
          </div>
        </div>

        {/* Bottom dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
