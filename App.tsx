import React, { useState, useCallback, useEffect } from 'react';
import { GameSession, GameState } from './types';
import { generateGameSession } from './services/geminiService';
import { FALLBACK_SESSION } from './constants';
import LevelView from './components/LevelView';
import ColoringView from './components/ColoringView';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [session, setSession] = useState<GameSession | null>(null);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Set language to Turkish for correct pronunciation
    utterance.lang = 'tr-TR'; 
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const startGame = async () => {
    setGameState(GameState.LOADING);
    try {
      // Check if API key exists, otherwise use fallback immediately to avoid broken UI
      if (process.env.API_KEY) {
          const newSession = await generateGameSession();
          setSession(newSession);
      } else {
          console.log("Using fallback session (No API Key)");
          setSession(FALLBACK_SESSION);
      }
      setCurrentLevelIndex(0);
      setGameState(GameState.PLAYING);
    } catch (e) {
      console.error(e);
      // If API fails, fall back gracefully
      setSession(FALLBACK_SESSION);
      setCurrentLevelIndex(0);
      setGameState(GameState.PLAYING);
    }
  };

  const handleLevelComplete = () => {
    if (!session) return;
    if (currentLevelIndex < session.levels.length - 1) {
      setCurrentLevelIndex(prev => prev + 1);
    } else {
      setGameState(GameState.COLORING);
    }
  };

  const handleRestart = () => {
    setGameState(GameState.MENU);
    setSession(null);
  };

  // Dynamic Background
  const bgColor = session?.theme.background || '#f3f4f6';
  const primaryColor = session?.theme.primary || '#3b82f6';

  return (
    <div 
      className="min-h-screen w-full transition-colors duration-1000 flex flex-col select-none"
      style={{ backgroundColor: bgColor }}
    >
      {/* Header / Nav */}
      <header className="p-4 flex justify-between items-center w-full max-w-4xl mx-auto">
         <div className="text-4xl filter drop-shadow-sm animate-pulse">
            🧩🦁
         </div>
         {session && gameState === GameState.PLAYING && (
             <div className="flex gap-2">
                 {session.levels.map((_, idx) => (
                     <div 
                        key={idx} 
                        className={`h-4 w-4 rounded-full transition-all duration-300 ${idx <= currentLevelIndex ? 'scale-125 ring-2 ring-white' : 'opacity-50'}`}
                        style={{ backgroundColor: idx <= currentLevelIndex ? '#fbbf24' : '#d1d5db' }}
                     />
                 ))}
             </div>
         )}
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col relative overflow-hidden">
        {gameState === GameState.MENU && (
          <div className="flex flex-col items-center justify-center h-full gap-8 animate-fade-in p-4 text-center">
            <div className="text-9xl emoji-bounce mb-4">👋</div>
            
            <button
              onClick={startGame}
              className="w-32 h-32 rounded-full text-6xl shadow-xl hover:scale-110 active:scale-90 transition-all bg-green-500 flex items-center justify-center text-white border-4 border-green-300"
              aria-label="Start Game"
            >
              ▶️
            </button>
            {!process.env.API_KEY && (
                <p className="text-3xl opacity-50">🧪</p>
            )}
          </div>
        )}

        {gameState === GameState.LOADING && (
          <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="animate-spin text-8xl">⏳</div>
          </div>
        )}

        {gameState === GameState.PLAYING && session && (
          <LevelView
            key={currentLevelIndex} // Force remount on level change
            level={session.levels[currentLevelIndex]}
            theme={session.theme}
            onComplete={handleLevelComplete}
            speak={speak}
          />
        )}

        {gameState === GameState.COLORING && session && (
          <ColoringView
            data={session.coloring}
            theme={session.theme}
            onRestart={handleRestart}
            speak={speak}
          />
        )}
      </main>
    </div>
  );
};

export default App;