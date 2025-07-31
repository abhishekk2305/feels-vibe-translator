import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Mic, Keyboard, Image, Video, Quote, Sparkles, Zap, TrendingUp, Share2, ExternalLink } from "lucide-react";
import { SiWhatsapp, SiInstagram } from "react-icons/si";
import MoodSelector from "@/components/MoodSelector";
import VoiceRecorder from "@/components/VoiceRecorder";
import AnalyzingAnimation from "@/components/AnalyzingAnimation";
import QuickActions from "@/components/QuickActions";
import ARStickerCreator from "@/components/ARStickerCreator";
import ViralChallengeGenerator from "@/components/ViralChallengeGenerator";

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

export default function VibeCreator() {
  const [, setLocation] = useLocation();
  const [inputType, setInputType] = useState<"text" | "voice" | "image">("text");
  const [textInput, setTextInput] = useState("");
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [contentStyle, setContentStyle] = useState("meme");
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [step, setStep] = useState(1); // 1: input, 2: customize, 3: analysis, 4: result
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showARCreator, setShowARCreator] = useState(false);
  const [showChallengeGenerator, setShowChallengeGenerator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    },
  });

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/vibe/analyze-image", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to analyze image");
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setStep(2);
    },
    onError: (error) => {
      toast({
        title: "Image Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateContentMutation = useMutation({
    mutationFn: async (data: VibeResult & { userText: string; style: string }) => {
      const response = await apiRequest("POST", "/api/vibe/generate-meme", {
        emotion: data.emotion,
        mood: data.mood,
        userText: data.userText,
        style: data.style,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMemeResult(data);
      setStep(3);
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
    if (inputType === "text") {
      if (!textInput.trim()) {
        toast({
          title: "Tell us your vibe!",
          description: "Please enter how you're feeling",
          variant: "destructive",
        });
        return;
      }
      setStep(2); // Go to customize step first
    }
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    analyzeTextMutation.mutate(textInput);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      analyzeImageMutation.mutate(file);
    }
  };

  const handleGenerate = () => {
    if (vibeResult) {
      generateContentMutation.mutate({
        ...vibeResult,
        userText: textInput,
        style: contentStyle,
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
        caption: memeResult.caption,
        isStory: false,
      });
    }
  };

  const toggleMood = (moodId: string) => {
    setSelectedMoods(prev => 
      prev.includes(moodId) 
        ? prev.filter(id => id !== moodId)
        : [...prev, moodId]
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-sm mx-auto overflow-hidden">
        {/* Header - Enhanced */}
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
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse animation-delay-200"></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse animation-delay-400"></div>
            </div>
          </div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-4 space-y-6">
            {/* AI Prompt Input - Theme Matched */}
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
                    <p className="text-xs text-gray-400">describe ur current mood and watch the magic happen</p>
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

            {/* Quick Actions for text input */}
            {inputType === "text" && !textInput && (
              <QuickActions 
                onActionSelect={(prompt) => setTextInput(prompt)}
              />
            )}

            {/* Input Method Selection */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">How do you want to express yourself?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={inputType === "text" ? "default" : "outline"}
                    onClick={() => setInputType("text")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "text" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Keyboard className="w-6 h-6" />
                    <span className="text-xs">Type</span>
                  </Button>
                  <Button
                    variant={inputType === "voice" ? "default" : "outline"}
                    onClick={() => setInputType("voice")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "voice" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Mic className="w-6 h-6" />
                    <span className="text-xs">Voice</span>
                  </Button>
                  <Button
                    variant={inputType === "image" ? "default" : "outline"}
                    onClick={() => {
                      setInputType("image");
                      fileInputRef.current?.click();
                    }}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      inputType === "image" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-xs">Photo</span>
                  </Button>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </CardContent>
            </Card>

            {/* Content Style */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">Content Style</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={contentStyle === "meme" ? "default" : "outline"}
                    onClick={() => setContentStyle("meme")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      contentStyle === "meme" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-xs">Meme</span>
                  </Button>
                  <Button
                    variant={contentStyle === "video" ? "default" : "outline"}
                    onClick={() => setContentStyle("video")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      contentStyle === "video" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Video className="w-6 h-6" />
                    <span className="text-xs">Video</span>
                  </Button>
                  <Button
                    variant={contentStyle === "quote" ? "default" : "outline"}
                    onClick={() => setContentStyle("quote")}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 ${
                      contentStyle === "quote" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    } max-w-full overflow-hidden min-h-[80px]`}
                  >
                    <Quote className="w-6 h-6" />
                    <span className="text-xs">Quote</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Mood Selection */}
            <MoodSelector
              moods={moods}
              selectedMoods={selectedMoods}
              onMoodChange={setSelectedMoods}
              maxSelection={3}
            />

            {/* Voice Recording Interface */}
            {inputType === "voice" && (
              <VoiceRecorder 
                onRecordingComplete={(blob) => {
                  console.log("Voice recorded:", blob);
                  toast({
                    title: "Voice Recorded!",
                    description: "Your audio is ready for analysis",
                  });
                }}
                maxDuration={30}
              />
            )}

            {/* Creative Tools Section */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">creative tools ✨</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      if (showARCreator) {
                        setShowARCreator(false); // Close if already open
                      } else {
                        setShowARCreator(true);
                        setShowChallengeGenerator(false); // Close the other one
                      }
                    }}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all min-h-[90px] ${
                      showARCreator 
                        ? "gradient-bg text-white shadow-lg" 
                        : "bg-gray-700 text-gray-100 hover:bg-gray-600 hover:text-white border border-gray-600"
                    }`}
                  >
                    <Sparkles className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center w-full">
                      <div className="text-xs font-bold leading-tight">AR Stickers</div>
                      <div className="text-xs opacity-80 leading-tight">camera effects</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => {
                      if (showChallengeGenerator) {
                        setShowChallengeGenerator(false); // Close if already open
                      } else {
                        setShowChallengeGenerator(true);
                        setShowARCreator(false); // Close the other one
                      }
                    }}
                    className={`p-3 flex flex-col items-center justify-center space-y-1 rounded-xl transition-all min-h-[90px] ${
                      showChallengeGenerator 
                        ? "gradient-bg text-white shadow-lg" 
                        : "bg-gray-700 text-gray-100 hover:bg-gray-600 hover:text-white border border-gray-600"
                    }`}
                  >
                    <TrendingUp className="w-5 h-5 flex-shrink-0" />
                    <div className="text-center w-full">
                      <div className="text-xs font-bold leading-tight">Viral Challenge</div>
                      <div className="text-xs opacity-80 leading-tight">trending ideas</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AR Sticker Creator */}
            {showARCreator && (
              <ARStickerCreator 
                onStickerComplete={(imageData) => {
                  toast({
                    title: "AR Sticker Ready! ✨",
                    description: "ur custom AR creation is fire",
                  });
                  setShowARCreator(false);
                }}
              />
            )}

            {/* Viral Challenge Generator */}
            {showChallengeGenerator && (
              <ViralChallengeGenerator 
                onChallengeSelect={(challenge) => {
                  setTextInput(challenge.description);
                  setShowChallengeGenerator(false);
                  toast({
                    title: "Challenge Selected! 🔥",
                    description: `ready to create: ${challenge.title}`,
                  });
                }}
              />
            )}

            {/* Generate Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!textInput.trim() || analyzeTextMutation.isPending || analyzeImageMutation.isPending}
              className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg"
            >
              <span className="mr-2">✨</span>
              Next: Customize
            </Button>
          </div>
        )}

        {/* Analyzing Animation */}
        {isAnalyzing && (
          <div className="p-4">
            <AnalyzingAnimation message="AI is analyzing your vibe..." />
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {step === 2 && vibeResult && !isAnalyzing && (
          <div className="p-4 space-y-6">
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
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
                    <span className="text-gray-400">Intensity</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < vibeResult.intensity ? "bg-primary" : "bg-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-primary font-semibold">{vibeResult.intensity}/10</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generateContentMutation.isPending}
                  className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                >
                  {generateContentMutation.isPending ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating Your Content...
                    </>
                  ) : (
                    "Generate My Content 🎨"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Generated Content */}
        {step === 3 && memeResult && (
          <div className="p-4 space-y-6">
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">ur vibe is ready! ✨</h3>
                
                <div className="relative rounded-xl overflow-hidden mb-4 shadow-2xl">
                  <img 
                    src={memeResult.imageUrl} 
                    alt="Generated content" 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>
                  
                  {/* Enhanced Caption Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <p className="text-white font-bold text-lg text-center leading-tight">
                        {memeResult.caption}
                      </p>
                    </div>
                  </div>
                  
                  {/* AI Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white text-xs font-semibold flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Generated</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePost}
                    disabled={createPostMutation.isPending}
                    className="w-full gradient-bg text-white py-4 rounded-xl font-semibold text-lg"
                  >
                    {createPostMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        posting to feed...
                      </>
                    ) : (
                      <>
                        <Share2 className="w-5 h-5 mr-2" />
                        share to feels feed
                      </>
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => {
                        const shareText = `Check out my AI vibe: ${memeResult.caption}`;
                        const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
                        window.open(shareUrl, '_blank');
                      }}
                      variant="outline"
                      className="bg-green-500 hover:bg-green-600 text-white border-green-500 flex items-center justify-center"
                    >
                      <SiWhatsapp className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out my AI vibe: ${memeResult.caption}`);
                        toast({
                          title: "Copied!",
                          description: "paste this in ur instagram story",
                        });
                      }}
                      variant="outline"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-purple-500 flex items-center justify-center"
                    >
                      <SiInstagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                  </div>

                  {/* Download Button */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = memeResult.imageUrl;
                      link.download = 'my-vibe.png';
                      link.click();
                    }}
                    className="w-full bg-gray-800 hover:bg-gray-700 border-gray-600 text-white py-3 rounded-xl"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    download image
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setStep(1);
                      setVibeResult(null);
                      setMemeResult(null);
                      setTextInput("");
                    }}
                    className="w-full text-gray-400 hover:text-white py-3"
                  >
                    create another vibe ✨
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
