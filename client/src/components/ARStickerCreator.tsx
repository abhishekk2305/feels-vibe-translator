import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { 
  Camera, 
  Sparkles, 
  RotateCcw, 
  Download, 
  Move, 
  RotateCw,
  ZoomIn,
  ZoomOut,
  Palette
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color?: string;
}

interface ARStickerCreatorProps {
  onStickerComplete?: (imageData: string) => void;
}

export default function ARStickerCreator({ onStickerComplete }: ARStickerCreatorProps) {
  const [isActive, setIsActive] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<'move' | 'rotate' | 'scale'>('move');
  const [scale, setScale] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  // Popular AR stickers
  const stickerOptions = [
    "😍", "🔥", "💯", "✨", "💖", "😎", "🤩", "🦄",
    "🌈", "⚡", "💫", "🎉", "🎊", "👑", "💎", "🌟",
    "🔮", "🧚‍♀️", "🦋", "🌸", "🍀", "🌺", "🌙", "☀️",
    "❤️", "💛", "💚", "💙", "💜", "🧡", "🖤", "🤍"
  ];

  const colorOptions = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
  ];

  useEffect(() => {
    if (isActive) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "couldn't access camera - check permissions",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const addSticker = (emoji: string) => {
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji,
      x: 50,
      y: 50,
      scale: 1,
      rotation: 0
    };
    setStickers(prev => [...prev, newSticker]);
    setSelectedSticker(newSticker.id);
  };

  const updateSelectedSticker = (updates: Partial<Sticker>) => {
    if (!selectedSticker) return;
    
    setStickers(prev => prev.map(sticker => 
      sticker.id === selectedSticker 
        ? { ...sticker, ...updates }
        : sticker
    ));
  };

  const deleteSticker = (id: string) => {
    setStickers(prev => prev.filter(s => s.id !== id));
    setSelectedSticker(null);
  };

  const captureWithStickers = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Draw stickers
    stickers.forEach(sticker => {
      ctx.save();
      
      const x = (sticker.x / 100) * canvas.width;
      const y = (sticker.y / 100) * canvas.height;
      
      ctx.translate(x, y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      ctx.scale(sticker.scale, sticker.scale);
      
      // Set sticker style
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      if (sticker.color) {
        ctx.fillStyle = sticker.color;
        ctx.fillText(sticker.emoji, 0, 0);
      } else {
        ctx.fillText(sticker.emoji, 0, 0);
      }
      
      ctx.restore();
    });

    // Convert to data URL
    const imageData = canvas.toDataURL('image/png');
    onStickerComplete?.(imageData);
    
    toast({
      title: "AR Sticker Created! ✨",
      description: "ur vibe has been captured with style",
    });
  };

  const resetStickers = () => {
    setStickers([]);
    setSelectedSticker(null);
  };

  if (!isActive) {
    return (
      <Card className="bg-semi-dark border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">AR Sticker Magic ✨</h3>
          <p className="text-gray-400 mb-4">add sick stickers to ur selfies with AR effects</p>
          <Button 
            onClick={() => setIsActive(true)}
            className="gradient-bg text-white px-6 py-2 rounded-xl font-semibold"
          >
            <Camera className="w-4 h-4 mr-2" />
            start creating
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="bg-semi-dark border-gray-700">
        <CardContent className="p-4">
          <div className="relative">
            {/* Camera View */}
            <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Stickers Overlay */}
              <div className="absolute inset-0">
                {stickers.map(sticker => (
                  <div
                    key={sticker.id}
                    className={`absolute cursor-pointer transition-all duration-200 ${
                      selectedSticker === sticker.id ? 'ring-2 ring-primary' : ''
                    }`}
                    style={{
                      left: `${sticker.x}%`,
                      top: `${sticker.y}%`,
                      transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                      color: sticker.color
                    }}
                    onClick={() => setSelectedSticker(sticker.id)}
                    onDoubleClick={() => deleteSticker(sticker.id)}
                  >
                    <span className="text-4xl select-none">{sticker.emoji}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Hidden canvas for capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Sticker Selection */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-white mb-2">choose ur sticker</h4>
            <div className="grid grid-cols-8 gap-2 max-h-24 overflow-y-auto">
              {stickerOptions.map(emoji => (
                <Button
                  key={emoji}
                  variant="ghost"
                  className="aspect-square p-1 text-2xl hover:bg-gray-700"
                  onClick={() => addSticker(emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </div>

          {/* Controls */}
          {selectedSticker && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant={currentTool === 'move' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTool('move')}
                  className="flex-1"
                >
                  <Move className="w-4 h-4" />
                </Button>
                <Button
                  variant={currentTool === 'rotate' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTool('rotate')}
                  className="flex-1"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
                <Button
                  variant={currentTool === 'scale' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentTool('scale')}
                  className="flex-1"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              {currentTool === 'scale' && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">size</label>
                  <Slider
                    value={scale}
                    onValueChange={(value) => {
                      setScale(value);
                      updateSelectedSticker({ scale: value[0] / 100 });
                    }}
                    max={200}
                    min={50}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}

              {currentTool === 'rotate' && (
                <div className="space-y-2">
                  <label className="text-xs text-gray-400">rotation</label>
                  <Slider
                    value={rotation}
                    onValueChange={(value) => {
                      setRotation(value);
                      updateSelectedSticker({ rotation: value[0] });
                    }}
                    max={360}
                    min={0}
                    step={15}
                    className="w-full"
                  />
                </div>
              )}

              {/* Color Options */}
              <div className="space-y-2">
                <label className="text-xs text-gray-400">vibe color</label>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSelectedSticker({ color: undefined })}
                    className="text-xs"
                  >
                    default
                  </Button>
                  {colorOptions.map(color => (
                    <button
                      key={color}
                      className="w-6 h-6 rounded-full border-2 border-gray-600"
                      style={{ backgroundColor: color }}
                      onClick={() => updateSelectedSticker({ color })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={resetStickers}
              className="flex-1"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              reset
            </Button>
            <Button
              onClick={captureWithStickers}
              disabled={stickers.length === 0}
              className="flex-1 gradient-bg text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              capture vibe ✨
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setIsActive(false)}
            className="w-full mt-2 text-gray-400"
          >
            close AR creator
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}