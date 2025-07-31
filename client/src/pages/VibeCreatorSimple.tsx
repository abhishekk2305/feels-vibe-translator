import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Sparkles, Zap, Heart, Smile } from "lucide-react";
import AnalyzingAnimation from "@/components/AnalyzingAnimation";
import MoodSelectorPopup from "@/components/MoodSelectorPopup";
import QuickActionsPopup from "@/components/QuickActionsPopup";

interface VibeResult {
  emotion: string;
  mood: string;
  confidence: number;
  intensity: number;
}

interface MemeResult {
  imageUrl: string;
  caption: string;
  prompt: string;
}

export default function VibeCreatorSimple() {
  const [, setLocation] = useLocation();
  const [textInput, setTextInput] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [step, setStep] = useState(1); // 1: input, 2: analysis, 3: result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const { toast } = useToast();

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy", color: "from-yellow-400 to-orange-400" },
    { id: "chill", emoji: "😴", label: "Chill", color: "from-blue-400 to-cyan-400" },
    { id: "excited", emoji: "🔥", label: "Excited", color: "from-red-400 to-pink-400" },
    { id: "motivated", emoji: "💪", label: "Motivated", color: "from-green-400 to-emerald-400" },
    { id: "thoughtful", emoji: "🤔", label: "Thoughtful", color: "from-purple-400 to-indigo-400" },
    { id: "funny", emoji: "😂", label: "Funny", color: "from-pink-400 to-rose-400" },
    { id: "sad", emoji: "😢", label: "Sad", color: "from-gray-400 to-slate-400" },
    { id: "angry", emoji: "😠", label: "Angry", color: "from-red-500 to-orange-500" },
  ];

  const analyzeTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/vibe/analyze-text", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setStep(3);
      setIsAnalyzing(false);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsAnalyzing(false);
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: VibeResult & { userText: string; selectedMoods: string[]; style: string }) => {
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
        title: "Content Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      const response = await apiRequest("POST", "/api/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Posted Successfully!",
        description: "Your vibe has been shared to your feed",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Post Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!textInput.trim()) {
      toast({
        title: "Tell us your vibe!",
        description: "Please enter how you're feeling",
        variant: "destructive",
      });
      return;
    }
    setIsAnalyzing(true);
    analyzeTextMutation.mutate(textInput);
  };

  const handleGenerate = () => {
    if (vibeResult) {
      generateContentMutation.mutate({
        ...vibeResult,
        userText: textInput,
        selectedMoods: selectedMoods,
        style: "meme",
      });
    }
  };

  const handlePost = () => {
    if (memeResult && vibeResult) {
      createPostMutation.mutate({
        content: textInput,
        aiPrompt: memeResult.prompt,
        mediaUrl: memeResult.imageUrl,
        mediaType: "image",
        detectedEmotion: vibeResult.emotion,
        mood: vibeResult.mood,
        selectedMoods: selectedMoods,
        caption: memeResult.caption,
        isStory: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="relative p-4 pt-8 bg-card border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-foreground p-2 absolute left-4 top-8 z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              create vibe ✨
            </h1>
            <p className="text-sm text-muted-foreground">turn ur feelings into viral content</p>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-muted rounded-full p-2 mr-3 border border-border">
                    <div className="w-5 h-5 text-primary">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center">
                      Tell AI Your Vibe
                      <span className="ml-2 text-xs">🧠</span>
                    </h3>
                    <p className="text-sm text-muted-foreground">describe ur current mood and watch the magic happen</p>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="what's ur vibe rn? feeling excited, stressed, creative, or something else entirely..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="bg-input border-border text-foreground resize-none placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all duration-200"
                    rows={4}
                  />
                  {textInput && (
                    <div className="absolute top-2 right-2">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                  )}
                </div>
                {textInput && (
                  <div className="mt-2 p-2 bg-muted rounded-lg border border-border">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span className="text-green-500 mr-1">●</span>
                      vibe captured! ready to analyze ur energy
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Popup Triggers - Facebook-style */}
            <div className="flex gap-3 mb-4">
              <Button
                onClick={() => {
                  setShowQuickActions(!showQuickActions);
                  setShowMoodSelector(false);
                }}
                variant="outline"
                className={`flex-1 p-3 rounded-xl transition-all ${
                  showQuickActions 
                    ? "gradient-bg text-white border-transparent" 
                    : "bg-card text-foreground border-border hover:bg-accent"
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                <span className="text-sm">Quick Vibes</span>
              </Button>
              <Button
                onClick={() => {
                  setShowMoodSelector(!showMoodSelector);
                  setShowQuickActions(false);
                }}
                variant="outline"
                className={`flex-1 p-3 rounded-xl transition-all ${
                  showMoodSelector 
                    ? "gradient-bg text-white border-transparent" 
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
                }`}
              >
                <Heart className="w-4 h-4 mr-2" />
                <span className="text-sm">Select Mood</span>
                {selectedMoods.length > 0 && (
                  <span className="ml-1 bg-purple-500 text-xs px-1.5 py-0.5 rounded-full">
                    {selectedMoods.length}
                  </span>
                )}
              </Button>
            </div>

            {/* Quick Actions Popup */}
            {showQuickActions && (
              <div className="mb-4 animate-in slide-in-from-top-2 duration-200 w-full">
                <QuickActionsPopup 
                  onActionSelect={(prompt) => {
                    setTextInput(prompt);
                    setShowQuickActions(false);
                  }}
                />
              </div>
            )}

            {/* Mood Selector Popup */}
            {showMoodSelector && (
              <div className="mb-4 animate-in slide-in-from-top-2 duration-200 w-full">
                <MoodSelectorPopup
                  moods={moods}
                  selectedMoods={selectedMoods}
                  onMoodChange={(moods) => {
                    setSelectedMoods(moods);
                    if (moods.length > 0) {
                      setTimeout(() => setShowMoodSelector(false), 500);
                    }
                  }}
                  maxSelection={3}
                />
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={!textInput.trim() || analyzeTextMutation.isPending}
              className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg mb-4"
            >
              <span className="mr-2">✨</span>
              Analyze My Vibe
            </Button>

            {/* Viral Challenge Section - Always Open */}
            <Card className="bg-semi-dark border-gray-700 shadow-lg mb-4">
              <CardContent className="p-3">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-800 rounded-full p-2 mr-3 border border-gray-600">
                    <div className="w-4 h-4 text-red-400">
                      <span>🔥</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      Viral Challenges
                      <span className="ml-2 text-xs">🚀</span>
                    </h3>
                    <p className="text-sm text-gray-400">join trending challenges</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {[
                    { name: "Vibe Check Challenge", hashtag: "#VibeCheck2025", trend: "🔥 Trending", accent: "border-red-500/50 bg-red-500/10" },
                    { name: "Mood Transformation", hashtag: "#MoodFlip", trend: "✨ Hot", accent: "border-purple-500/50 bg-purple-500/10" },
                    { name: "Energy Boost Dance", hashtag: "#EnergyBoost", trend: "💯 Viral", accent: "border-cyan-500/50 bg-cyan-500/10" }
                  ].map((challenge, idx) => (
                    <Button
                      key={idx}
                      className={`w-full text-left bg-gray-800 hover:bg-gray-700 border ${challenge.accent} p-3 h-auto transition-all`}
                      onClick={() => {
                        toast({
                          title: "Challenge Started!",
                          description: `${challenge.name} challenge activated`,
                        });
                      }}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm leading-tight">{challenge.name}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{challenge.hashtag}</p>
                        </div>
                        <div className="flex-shrink-0 ml-3">
                          <span className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full border border-gray-600">
                            {challenge.trend}
                          </span>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analyzing Animation */}
        {isAnalyzing && (
          <div className="p-4">
            <AnalyzingAnimation message="AI is analyzing your vibe..." />
          </div>
        )}

        {/* Step 3: Analysis Results */}
        {step === 3 && vibeResult && !isAnalyzing && (
          <div className="p-4 space-y-4">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Your Vibe Analysis</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-300">Emotion</span>
                    <span className="text-white font-semibold capitalize">{vibeResult.emotion}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-300">Mood</span>
                    <span className="text-white font-semibold capitalize">{vibeResult.mood}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-300">Confidence</span>
                    <span className="text-green-400 font-semibold">{Math.round(vibeResult.confidence * 100)}%</span>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isPending}
                  className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Meme
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Generated Content */}
        {step === 4 && memeResult && (
          <div className="p-4 space-y-4">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-white mb-4">Your Viral Content</h3>
                
                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                  <img 
                    src={memeResult.imageUrl} 
                    alt="Generated meme"
                    className="w-full rounded-lg mb-3"
                  />
                  <p className="text-white font-medium">{memeResult.caption}</p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1"
                  >
                    Create Another
                  </Button>
                  <Button
                    onClick={handlePost}
                    disabled={createPostMutation.isPending}
                    className="flex-1 gradient-bg text-white"
                  >
                    {createPostMutation.isPending ? "Posting..." : "Share to Feed"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}