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
    <div className="min-h-screen flex flex-col justify-center items-center p-6 gradient-bg">
      <div className="w-full max-w-sm mx-auto">
        {/* App Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-6 animate-bounce">
            <svg className="w-12 h-12 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 font-poppins">Remixz</h1>
          <p className="text-xl text-white/90 mb-2">Transform your vibes into viral content</p>
          <p className="text-sm text-white/75">AI-powered meme & content generator for Gen Z</p>
        </div>

        {!showDemo ? (
          <div className="space-y-4">
            <Button 
              onClick={startDemo}
              className="w-full bg-white text-primary-dark hover:bg-gray-100 py-4 text-lg font-semibold rounded-2xl shadow-lg"
            >
              ✨ Try the Magic
            </Button>
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="w-full border-2 border-white text-white hover:bg-white hover:text-primary-dark py-4 text-lg font-semibold rounded-2xl bg-transparent"
            >
              Sign In to Continue
            </Button>
          </div>
        ) : (
          <Card className="glass-effect border-white/20">
            <CardContent className="p-6 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-white">Preparing your vibe experience...</p>
            </CardContent>
          </Card>
        )}

        {/* Features Preview */}
        <div className="mt-12 space-y-4">
          <div className="glass-effect rounded-2xl p-4 border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🎭</span>
              <span className="font-medium text-white">Emotion Detection</span>
            </div>
            <p className="text-sm text-white/75">Express through text, voice, or photos</p>
          </div>
          
          <div className="glass-effect rounded-2xl p-4 border-white/20">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-2xl">🤖</span>
              <span className="font-medium text-white">AI Meme Generation</span>
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
