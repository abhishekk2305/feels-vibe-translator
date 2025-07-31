import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

interface MoodSelectorProps {
  moods: Mood[];
  selectedMoods: string[];
  onMoodChange: (moodIds: string[]) => void;
  maxSelection?: number;
}

export default function MoodSelector({ 
  moods, 
  selectedMoods, 
  onMoodChange, 
  maxSelection = 3 
}: MoodSelectorProps) {
  const [hoveredMood, setHoveredMood] = useState<string | null>(null);

  const toggleMood = (moodId: string) => {
    if (selectedMoods.includes(moodId)) {
      onMoodChange(selectedMoods.filter(id => id !== moodId));
    } else if (selectedMoods.length < maxSelection) {
      onMoodChange([...selectedMoods, moodId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Select Your Mood</h3>
        <p className="text-sm text-gray-400">Choose up to {maxSelection} moods that match your vibe</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {moods.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          const isHovered = hoveredMood === mood.id;
          const canSelect = selectedMoods.length < maxSelection || isSelected;
          
          return (
            <Card
              key={mood.id}
              className={`
                cursor-pointer transition-all duration-300 relative overflow-hidden
                ${isSelected 
                  ? `glass-card border-2 bg-gradient-to-r ${mood.color} border-white/30` 
                  : `glass-card border border-white/10 hover:border-white/20 ${!canSelect ? 'opacity-50' : ''}`
                }
                ${isHovered && canSelect ? 'scale-105' : ''}
              `}
              onClick={() => canSelect && toggleMood(mood.id)}
              onMouseEnter={() => setHoveredMood(mood.id)}
              onMouseLeave={() => setHoveredMood(null)}
            >
              <CardContent className="p-3 text-center relative z-10 max-w-full overflow-hidden">
                <div className={`text-2xl mb-1 transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}>
                  {mood.emoji}
                </div>
                <p className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-gray-300'} truncate`}>
                  {mood.label}
                </p>
                
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </CardContent>
              
              {isSelected && (
                <div className={`absolute inset-0 bg-gradient-to-r ${mood.color} opacity-20`}></div>
              )}
            </Card>
          );
        })}
      </div>
      
      {selectedMoods.length > 0 && (
        <div className="text-center">
          <p className="text-xs text-gray-400">
            {selectedMoods.length}/{maxSelection} moods selected
          </p>
        </div>
      )}
    </div>
  );
}