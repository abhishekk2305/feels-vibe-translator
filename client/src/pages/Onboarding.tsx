import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface VibeResult {
  emotion: string;
  mood: string;
  confidence: number;
}

interface MemeResult {
  imageUrl: string;
  caption: string;
  prompt: string;
}

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [vibeInput, setVibeInput] = useState("");
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const { toast } = useToast();

  const demoSteps = [
    {
      title: "Welcome to Feels!",
      subtitle: "Let's create your first AI-powered vibe",
      content: "In just 3 steps, you'll see how your emotions become viral content"
    },
    {
      title: "Share Your Vibe",
      subtitle: "Tell us how you're feeling right now",
      content: "Type anything - your mood, what happened today, or just random thoughts"
    },
    {
      title: "AI Magic in Progress",
      subtitle: "Our AI is analyzing your emotions",
      content: "Detecting mood, energy level, and the perfect content style for you"
    },
    {
      title: "Your Viral Content",
      subtitle: "AI-generated meme just for your vibe",
      content: "Ready to share with the world!"
    }
  ];

  const analyzeVibeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/vibe/analyze-text", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setStep(3);
    },
    onError: (error) => {
      toast({
        title: "Vibe Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateMemeMutation = useMutation({
    mutationFn: async (data: VibeResult & { userText: string }) => {
      const response = await apiRequest("POST", "/api/vibe/generate-meme", {
        emotion: data.emotion,
        mood: data.mood,
        userText: data.userText,
        style: "meme",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMemeResult(data);
      setStep(4);
    },
    onError: (error) => {
      toast({
        title: "Meme Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVibeAnalysis = () => {
    if (!vibeInput.trim()) {
      toast({
        title: "Tell us your vibe!",
        description: "Please enter how you're feeling",
        variant: "destructive",
      });
      return;
    }
    analyzeVibeMutation.mutate(vibeInput);
  };

  const handleMemeGeneration = () => {
    if (vibeResult) {
      generateMemeMutation.mutate({ ...vibeResult, userText: vibeInput });
    }
  };

  const finishOnboarding = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-dark-bg p-6">
      <div className="w-full max-w-sm mx-auto pt-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Feel the Magic</h2>
          <p className="text-gray-400">Let's see how AI translates your vibe</p>
        </div>

        {/* Step 1: Input Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">How are you feeling?</h3>
                <p className="text-gray-400 mb-4">Express yourself and watch the AI create magic</p>
                
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-primary text-xl">⌨️</span>
                      <span className="text-white font-medium">Type your vibe</span>
                    </div>
                    <Textarea
                      placeholder="I'm feeling excited about..."
                      value={vibeInput}
                      onChange={(e) => setVibeInput(e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white resize-none"
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!vibeInput.trim()}
                    className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                  >
                    Continue ✨
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Confirmation */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Ready for AI Magic?</h3>
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <p className="text-white">{vibeInput}</p>
                </div>
                <p className="text-gray-400 mb-6">Our AI will analyze your emotion and create a personalized meme!</p>
                
                <Button
                  onClick={handleVibeAnalysis}
                  disabled={analyzeVibeMutation.isPending}
                  className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                >
                  {analyzeVibeMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Analyzing Your Vibe...
                    </>
                  ) : (
                    "Analyze My Vibe ✨"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Vibe Results */}
        {step === 3 && vibeResult && (
          <div className="space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Vibe Analysis</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Emotion</span>
                    <span className="text-primary font-semibold capitalize">{vibeResult.emotion}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Mood</span>
                    <span className="text-secondary font-semibold capitalize">{vibeResult.mood}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Confidence</span>
                    <span className="text-neon-green font-semibold">{Math.round(vibeResult.confidence * 100)}%</span>
                  </div>
                </div>

                <Button
                  onClick={handleMemeGeneration}
                  disabled={generateMemeMutation.isPending}
                  className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                >
                  {generateMemeMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Your Meme...
                    </>
                  ) : (
                    "Generate My Meme 🎨"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Generated Meme */}
        {step === 4 && memeResult && (
          <div className="space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your AI-Generated Meme!</h3>
                
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img 
                    src={memeResult.imageUrl} 
                    alt="Generated meme" 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-bold text-center">{memeResult.caption}</p>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6 text-center">
                  This is just the beginning! Join Remixz to create unlimited content.
                </p>

                <Button
                  onClick={finishOnboarding}
                  className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                >
                  Join Remixz Now! 🚀
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center space-x-2 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? "bg-primary" : i < step ? "bg-secondary" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
