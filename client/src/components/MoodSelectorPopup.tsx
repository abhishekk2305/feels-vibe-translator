import { Button } from "@/components/ui/button";

interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

interface MoodSelectorPopupProps {
  moods: Mood[];
  selectedMoods: string[];
  onMoodChange: (moods: string[]) => void;
  maxSelection?: number;
}

export default function MoodSelectorPopup({ 
  moods, 
  selectedMoods, 
  onMoodChange, 
  maxSelection = 3 
}: MoodSelectorPopupProps) {
  // This shows actual mood selection - different from quick actions!
  const handleMoodClick = (moodId: string) => {
    let newSelectedMoods;
    if (selectedMoods.includes(moodId)) {
      newSelectedMoods = selectedMoods.filter(id => id !== moodId);
    } else {
      if (selectedMoods.length >= maxSelection) {
        newSelectedMoods = [...selectedMoods.slice(1), moodId];
      } else {
        newSelectedMoods = [...selectedMoods, moodId];
      }
    }
    onMoodChange(newSelectedMoods);
  };

  return (
    <div className="bg-semi-dark border border-gray-600 rounded-2xl p-3 shadow-lg">
      {/* Facebook-style horizontal scrolling row */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {moods.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          return (
            <Button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`
                flex-shrink-0 w-16 h-16 rounded-full p-2 transition-all duration-200 transform hover:scale-110
                ${isSelected 
                  ? `bg-gradient-to-r ${mood.color} text-white shadow-lg ring-2 ring-white/50` 
                  : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }
              `}
              variant="ghost"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span className="text-lg mb-0.5">{mood.emoji}</span>
                <span className="text-xs font-medium leading-none text-center">{mood.label}</span>
              </div>
            </Button>
          );
        })}
      </div>
      
      {maxSelection && (
        <p className="text-xs text-gray-400 text-center mt-2">
          Select up to {maxSelection} moods • {selectedMoods.length}/{maxSelection} selected
        </p>
      )}
    </div>
  );
}