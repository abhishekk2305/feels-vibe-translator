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
  const [showARStickers, setShowARStickers] = useState(false);
  const [showViralChallenge, setShowViralChallenge] = useState(false);
  const [expandedTool, setExpandedTool] = useState<string | null>(null);
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
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto overflow-hidden">
        {/* Header */}
        <div className="relative p-4 pt-8 bg-semi-dark border-b border-gray-700">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white p-2 absolute left-4 top-8 z-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-1">
              create vibe ✨
            </h1>
            <p className="text-sm text-gray-400">turn ur feelings into viral content</p>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-4 space-y-4 max-h-screen overflow-y-auto">
            <Card className="bg-semi-dark border-gray-700 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-800 rounded-full p-2 mr-3 border border-gray-600">
                    <div className="w-5 h-5 text-purple-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      Tell AI Your Vibe
                      <span className="ml-2 text-xs">🧠</span>
                    </h3>
                    <p className="text-sm text-gray-400">describe ur current mood and watch the magic happen</p>
                  </div>
                </div>
                <div className="relative">
                  <Textarea
                    placeholder="what's ur vibe rn? feeling excited, stressed, creative, or something else entirely..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white resize-none placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all duration-200"
                    rows={4}
                  />
                  {textInput && (
                    <div className="absolute top-2 right-2">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                  )}
                </div>
                {textInput && (
                  <div className="mt-2 p-2 bg-gray-800 rounded-lg border border-gray-600">
                    <p className="text-xs text-gray-300 flex items-center">
                      <span className="text-green-400 mr-1">●</span>
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
                    : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
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

            {/* Creative Tools Section */}
            <Card className="bg-semi-dark border-gray-700 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-800 rounded-full p-2 mr-3 border border-gray-600">
                    <div className="w-5 h-5 text-cyan-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      Creative Tools
                      <span className="ml-2 text-xs">🎨</span>
                    </h3>
                    <p className="text-sm text-gray-400">AR stickers & viral challenges</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => setExpandedTool(expandedTool === 'ar' ? null : 'ar')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${
                      expandedTool === 'ar'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="w-4 h-4">📱</div>
                    AR Stickers
                  </Button>
                  
                  <Button
                    onClick={() => setExpandedTool(expandedTool === 'viral' ? null : 'viral')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm transition-all ${
                      expandedTool === 'viral'
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="w-4 h-4">🔥</div>
                    Viral Challenge
                  </Button>
                </div>

                {/* AR Stickers Expanded Content */}
                {expandedTool === 'ar' && (
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600 animate-in slide-in-from-top-2 duration-200">
                    <div className="grid grid-cols-6 gap-1.5 mb-2">
                      {['😎', '🔥', '💯', '✨', '🎉', '💖'].map((emoji, idx) => (
                        <Button
                          key={idx}
                          className="aspect-square bg-gray-700 hover:bg-gray-600 text-sm border border-gray-600 p-1"
                          onClick={() => {
                            toast({
                              title: "Added!",
                              description: `${emoji} sticker ready`,
                            });
                            setExpandedTool(null);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Viral Challenge Expanded Content */}
                {expandedTool === 'viral' && (
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg border border-gray-600 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1.5">
                      {[
                        { name: "Vibe Check", hashtag: "#VibeCheck2025", trend: "🔥" },
                        { name: "Mood Flip", hashtag: "#MoodFlip", trend: "✨" }
                      ].map((challenge, idx) => (
                        <Button
                          key={idx}
                          className="w-full text-left bg-gray-700 hover:bg-gray-600 border border-gray-600 p-2 h-auto"
                          onClick={() => {
                            toast({
                              title: "Challenge Started!",
                              description: `${challenge.name} activated`,
                            });
                            setExpandedTool(null);
                          }}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-white text-xs font-medium">{challenge.name}</p>
                              <p className="text-gray-400 text-xs">{challenge.hashtag}</p>
                            </div>
                            <span className="text-sm">{challenge.trend}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips Section to fill empty space */}
            <Card className="bg-semi-dark border-gray-700 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-gray-800 rounded-full p-2 mr-3 border border-gray-600">
                    <div className="w-5 h-5 text-yellow-400">
                      <svg fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white flex items-center">
                      Vibe Tips
                      <span className="ml-2 text-xs">💡</span>
                    </h3>
                    <p className="text-sm text-gray-400">get the best AI results</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="text-green-400 text-lg flex-shrink-0">✨</span>
                    <div>
                      <p className="text-white text-sm font-medium">Be specific about emotions</p>
                      <p className="text-gray-400 text-xs">instead of "sad", try "feeling overwhelmed after a long day"</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="text-blue-400 text-lg flex-shrink-0">🎯</span>
                    <div>
                      <p className="text-white text-sm font-medium">Add context</p>
                      <p className="text-gray-400 text-xs">mention what happened or where you are for better content</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    <span className="text-purple-400 text-lg flex-shrink-0">🌟</span>
                    <div>
                      <p className="text-white text-sm font-medium">Use mood combos</p>
                      <p className="text-gray-400 text-xs">select multiple moods for unique viral content</p>
                    </div>
                  </div>
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