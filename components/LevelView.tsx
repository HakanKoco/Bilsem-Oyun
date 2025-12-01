import React, { useEffect, useState } from 'react';
import { Level, Theme } from '../types';

interface LevelViewProps {
  level: Level;
  theme: Theme;
  onComplete: () => void;
  speak: (text: string) => void;
}

const LevelView: React.FC<LevelViewProps> = ({ level, theme, onComplete, speak }) => {
  // Store correctly found items
  const [found, setFound] = useState<string[]>([]);
  // Store a temporarily wrong selection for feedback animation
  const [wrong, setWrong] = useState<string | null>(null);

  useEffect(() => {
    // Announce the rule when the level mounts
    speak(level.voiceOver);
    setFound([]);
    setWrong(null);
  }, [level, speak]);

  const handleOptionClick = (option: string) => {
    // If already found or currently showing error, ignore
    if (found.includes(option) || wrong) return;

    const isCorrect = level.correct.includes(option);

    if (isCorrect) {
      const newFound = [...found, option];
      setFound(newFound);
      
      // Check if all correct items are found
      // Using Set to handle potential duplicates in data definition
      const distinctCorrect = new Set(level.correct);
      const distinctFound = new Set(newFound);

      if (distinctFound.size === distinctCorrect.size) {
        speak("Harika!");
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
         // Encouraging sound for partial progress
         speak("Evet!"); 
      }
    } else {
      setWrong(option);
      speak("Tekrar dene!");
      setTimeout(() => {
        setWrong(null);
      }, 1000);
    }
  };

  // Flatten options to handle cases where AI returns [["A"], ["B"]] or [["A", "B"]]
  const flatOptions = level.options.flat();

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-2xl mx-auto p-4">
      {/* Rules Section (Top) */}
      <div 
        className="w-full rounded-3xl p-6 shadow-lg mb-8 transition-colors duration-500 flex flex-col items-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-3xl mb-4">🧠</div>
        <div className="flex flex-wrap justify-center gap-8">
          {level.pairs.map((pair, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm">
              <span className="text-5xl">{pair.source}</span>
              <span className="text-3xl text-gray-300">➜</span>
              <span className="text-5xl">{pair.target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Challenge Section (Bottom) */}
      <div className="flex-1 w-full flex flex-col items-center justify-center">
        <div className="flex items-center gap-4 mb-12 animate-bounce">
          {level.question.map((q, idx) => (
             <span key={idx} className="text-8xl drop-shadow-md">{q}</span>
          ))}
          <span className="text-6xl text-gray-400">❓</span>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-md">
          {flatOptions.map((option, idx) => {
             const isFound = found.includes(option);
             const isWrong = wrong === option;
             
             let statusClass = 'bg-white hover:scale-105 active:scale-95';
             if (isFound) {
                 statusClass = 'bg-green-400 scale-105 ring-4 ring-green-200 opacity-50 cursor-default';
             } else if (isWrong) {
                 statusClass = 'bg-red-400 scale-95 ring-4 ring-red-200 shake-animation';
             }

             return (
              <button
                key={idx}
                onClick={() => handleOptionClick(option)}
                className={`
                  aspect-square rounded-3xl shadow-xl flex items-center justify-center text-7xl 
                  transition-all duration-300 border-b-8 border-black/5
                  ${statusClass}
                `}
              >
                {option}
              </button>
             );
          })}
        </div>
      </div>
      <style>{`
        .shake-animation {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
            10%, 90% { transform: translate3d(-1px, 0, 0); }
            20%, 80% { transform: translate3d(2px, 0, 0); }
            30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
            40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default LevelView;