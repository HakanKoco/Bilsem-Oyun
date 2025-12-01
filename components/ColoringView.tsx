
import React, { useEffect, useState } from 'react';
import { Coloring, Theme } from '../types';

interface ColoringViewProps {
  data: Coloring;
  theme: Theme;
  onRestart: () => void;
  speak: (text: string) => void;
}

const TEMPLATES: Record<string, string> = {
  fish: `
    <svg viewBox="0 0 100 100" class="w-full h-full cursor-pointer">
      <path d="M80 50 C60 20 20 20 10 50 C20 80 60 80 80 50 Z" fill="white" stroke="black" stroke-width="2"/>
      <path d="M80 50 L95 35 L95 65 Z" fill="white" stroke="black" stroke-width="2"/>
      <circle cx="30" cy="40" r="3" fill="black" />
      <path d="M50 50 Q60 50 60 60" fill="none" stroke="black" stroke-width="2"/>
    </svg>
  `,
  lion: `
    <svg viewBox="0 0 100 100" class="w-full h-full cursor-pointer">
       <!-- Mane -->
      <path d="M50 15 L55 5 L65 15 L75 5 L80 20 L95 25 L85 40 L95 50 L85 60 L95 75 L80 80 L75 95 L65 85 L55 95 L50 85 L45 95 L35 85 L25 95 L20 80 L5 75 L15 60 L5 50 L15 40 L5 25 L20 20 L25 5 L35 15 L45 5 Z" fill="white" stroke="black" stroke-width="2"/>
      <!-- Face -->
      <circle cx="50" cy="50" r="25" fill="white" stroke="black" stroke-width="2"/>
      <!-- Eyes -->
      <circle cx="42" cy="45" r="3" fill="black" />
      <circle cx="58" cy="45" r="3" fill="black" />
      <!-- Nose -->
      <path d="M47 55 L53 55 L50 60 Z" fill="black" />
      <!-- Mouth -->
      <path d="M50 60 L50 65 M45 65 Q50 70 55 65" fill="none" stroke="black" stroke-width="2"/>
    </svg>
  `,
  bird: `
    <svg viewBox="0 0 100 100" class="w-full h-full cursor-pointer">
      <!-- Body -->
      <path d="M20 60 Q20 30 50 30 Q80 30 80 60 Q80 90 50 90 Q20 90 20 60 Z" fill="white" stroke="black" stroke-width="2"/>
      <!-- Wing -->
      <path d="M40 60 Q50 50 70 60 Q50 80 40 60" fill="white" stroke="black" stroke-width="2"/>
      <!-- Beak -->
      <path d="M78 45 L90 50 L78 55" fill="white" stroke="black" stroke-width="2"/>
      <!-- Eye -->
      <circle cx="65" cy="45" r="3" fill="black" />
      <!-- Tail -->
      <path d="M20 60 L5 50 L5 70 Z" fill="white" stroke="black" stroke-width="2"/>
    </svg>
  `,
  cat: `
    <svg viewBox="0 0 100 100" class="w-full h-full cursor-pointer">
       <!-- Ears -->
      <path d="M30 35 L20 15 L40 25 Z" fill="white" stroke="black" stroke-width="2"/>
      <path d="M70 35 L80 15 L60 25 Z" fill="white" stroke="black" stroke-width="2"/>
      <!-- Head -->
      <circle cx="50" cy="50" r="30" fill="white" stroke="black" stroke-width="2"/>
      <!-- Eyes -->
      <ellipse cx="40" cy="45" rx="3" ry="5" fill="black" />
      <ellipse cx="60" cy="45" rx="3" ry="5" fill="black" />
      <!-- Nose -->
      <path d="M48 55 L52 55 L50 58 Z" fill="black" />
      <!-- Whiskers -->
      <path d="M30 55 L15 50 M30 60 L15 60 M30 65 L15 70" stroke="black" stroke-width="1"/>
      <path d="M70 55 L85 50 M70 60 L85 60 M70 65 L85 70" stroke="black" stroke-width="1"/>
    </svg>
  `
};

const ColoringView: React.FC<ColoringViewProps> = ({ data, theme, onRestart, speak }) => {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    // Announce reward (Generic Turkish text since JSON doesn't provide it)
    speak("Harika! Boyama zamanı."); 
    const template = TEMPLATES[data.templateId] || TEMPLATES['fish'];
    setSvgContent(template);
  }, [data, speak]);

  const handleColorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Simple logic: if clicked element is a path, circle, or rect, fill it with random color
    const target = e.target as HTMLElement;
    const tag = target.tagName.toLowerCase();
    if (['path', 'circle', 'rect', 'ellipse'].includes(tag)) {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF9F43', '#54A0FF', '#5f27cd', '#fd79a8'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        target.setAttribute('fill', randomColor);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 animate-bounce">🎨</h1>
      
      <div 
        className="relative w-full max-w-md aspect-square bg-white rounded-3xl shadow-2xl border-4 overflow-hidden mb-8 p-4" 
        style={{ borderColor: theme.primary }}
        onClick={handleColorClick}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      <button
        onClick={onRestart}
        className="px-8 py-4 rounded-full text-2xl font-bold text-white shadow-lg transform transition hover:scale-105 active:scale-95"
        style={{ backgroundColor: theme.primary }}
      >
        🔄
      </button>
    </div>
  );
};

export default ColoringView;
