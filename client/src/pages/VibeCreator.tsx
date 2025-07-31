import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Camera, Mic, Keyboard, Image, Video, Quote } from "lucide-react";

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
  const [selectedMoods, setSelectedMoods] = useState<string[]>(["happy"]);
  const [contentStyle, setContentStyle] = useState("meme");
  const [vibeResult, setVibeResult] = useState<VibeResult | null>(null);
  const [memeResult, setMemeResult] = useState<MemeResult | null>(null);
  const [step, setStep] = useState(1); // 1: input, 2: analysis, 3: result
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const moods = [
    { id: "happy", emoji: "😊", label: "Happy" },
    { id: "chill", emoji: "😴", label: "Chill" },
    { id: "excited", emoji: "🔥", label: "Excited" },
    { id: "motivated", emoji: "💪", label: "Motivated" },
    { id: "thoughtful", emoji: "🤔", label: "Thoughtful" },
    { id: "funny", emoji: "😂", label: "Funny" },
  ];

  const analyzeTextMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/vibe/analyze-text", { text });
      return response.json();
    },
    onSuccess: (data) => {
      setVibeResult(data);
      setStep(2);
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
      analyzeTextMutation.mutate(textInput);
    }
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
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8 bg-semi-dark">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="text-white p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Create Vibe</h1>
          <div className="w-9"></div>
        </div>

        {/* Step 1: Input */}
        {step === 1 && (
          <div className="p-4 space-y-6">
            {/* AI Prompt Input */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center text-white">
                  <span className="text-primary mr-2">🧠</span>
                  Tell AI Your Vibe
                </h3>
                <Textarea
                  placeholder="Describe how you're feeling or what you want to create..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white resize-none"
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Input Method Selection */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">How do you want to express yourself?</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={inputType === "text" ? "default" : "outline"}
                    onClick={() => setInputType("text")}
                    className={`p-4 flex flex-col items-center space-y-2 ${
                      inputType === "text" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Keyboard className="w-6 h-6" />
                    <span className="text-sm">Type</span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="p-4 flex flex-col items-center space-y-2 bg-gray-800 text-gray-500 cursor-not-allowed"
                  >
                    <Mic className="w-6 h-6" />
                    <span className="text-sm">Voice</span>
                  </Button>
                  <Button
                    variant={inputType === "image" ? "default" : "outline"}
                    onClick={() => {
                      setInputType("image");
                      fileInputRef.current?.click();
                    }}
                    className={`p-4 flex flex-col items-center space-y-2 ${
                      inputType === "image" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">Photo</span>
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
                    className={`p-4 flex flex-col items-center space-y-2 ${
                      contentStyle === "meme" 
                        ? "gradient-bg text-white" 
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    <Image className="w-6 h-6" />
                    <span className="text-sm">Meme</span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="p-4 flex flex-col items-center space-y-2 bg-gray-800 text-gray-500 cursor-not-allowed"
                  >
                    <Video className="w-6 h-6" />
                    <span className="text-sm">Video</span>
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    className="p-4 flex flex-col items-center space-y-2 bg-gray-800 text-gray-500 cursor-not-allowed"
                  >
                    <Quote className="w-6 h-6" />
                    <span className="text-sm">Quote</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Selection */}
            <Card className="bg-semi-dark border-gray-700">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-white">Mood Selector</h3>
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMoods.includes(mood.id) ? "default" : "outline"}
                      onClick={() => toggleMood(mood.id)}
                      className={`rounded-full text-sm ${
                        selectedMoods.includes(mood.id)
                          ? "bg-primary text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Button
              onClick={handleAnalyze}
              disabled={analyzeTextMutation.isPending || analyzeImageMutation.isPending}
              className="w-full gradient-bg text-white py-4 rounded-2xl font-semibold text-lg"
            >
              {(analyzeTextMutation.isPending || analyzeImageMutation.isPending) ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Analyzing Your Vibe...
                </>
              ) : (
                <>
                  <span className="mr-2">✨</span>
                  Analyze My Vibe
                </>
              )}
            </Button>
          </div>
        )}

        {/* Step 2: Analysis Results */}
        {step === 2 && vibeResult && (
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
                <h3 className="text-xl font-semibold text-white mb-4">Your AI Creation!</h3>
                
                <div className="relative rounded-xl overflow-hidden mb-4">
                  <img 
                    src={memeResult.imageUrl} 
                    alt="Generated content" 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-bold text-center">{memeResult.caption}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePost}
                    disabled={createPostMutation.isPending}
                    className="w-full gradient-bg text-white py-3 rounded-xl font-semibold"
                  >
                    {createPostMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Posting...
                      </>
                    ) : (
                      "Share to Feed 🚀"
                    )}
                  </Button>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                    >
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-pink-600 hover:bg-pink-700 text-white border-pink-600"
                    >
                      Instagram
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
