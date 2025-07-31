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
  console.log("MoodSelectorPopup rendering with mood options:", moods.map(m => m.label));
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
    <div className="border rounded-2xl p-3 shadow-lg" style={{ 
      width: '100%', 
      maxWidth: '100%',
      background: 'linear-gradient(135deg, hsl(262, 40%, 20%) 0%, hsl(262, 35%, 15%) 100%)',
      borderColor: 'hsl(262, 50%, 40%)'
    }}>
      {/* Facebook-style horizontal scrolling row */}
      <div className="horizontal-scroll-container" style={{ overflowX: 'scroll', width: '100%' }}>
        {moods.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`
                horizontal-scroll-item transition-all duration-200 transform hover:scale-110
              `}
              style={{
                border: 'none',
                background: isSelected 
                  ? 'linear-gradient(135deg, hsl(262, 83%, 58%), hsl(262, 83%, 48%))'
                  : 'hsl(262, 30%, 25%)',
                color: isSelected ? '#ffffff' : 'hsl(262, 70%, 85%)',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 2px rgba(255, 255, 255, 0.5)' : 'none'
              }}
            >
              <div className="flex flex-col items-center justify-center h-full w-full">
                <span className="text-base leading-none">{mood.emoji}</span>
                <span className="text-xs font-medium leading-tight text-center mt-1" style={{ fontSize: '10px', lineHeight: '1.1' }}>{mood.label}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {maxSelection && (
        <p className="text-xs text-center mt-2" style={{ color: 'hsl(262, 60%, 55%)' }}>
          Select up to {maxSelection} moods • {selectedMoods.length}/{maxSelection} selected
        </p>
      )}
    </div>
  );
}