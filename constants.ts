
import { GameSession } from './types';

export const GAME_GENERATION_PROMPT = `
You are an expert Game Designer for Turkish pre-school children (ages 5-6).

**STRICT RULES:**
1. **THEME:** MUST be ANIMAL based (Zoo, Forest, Farm).
2. **NO TEXT UI:** Use EMOJIS ONLY.
3. **NO PIGS:** Do NOT use the pig emoji (🐷, 🐖, 🐽).
4. **LOGIC CONSISTENCY:** Correct answers must always be in options.

**CONTENT REQUIREMENTS:**
1. **Levels:** Generate 3 levels of logic puzzles using ANIMALS.
2. **Coloring:** Select a templateId from ['fish', 'lion', 'bird', 'cat'].
3. **Vocabulary (CRITICAL):** Provide a list of EXACTLY 6 DISTINCT ANIMAL EMOJIS with their English names for the final screen.

**JSON OUTPUT FORMAT:**
{
  "theme": { "background": "#F0FFF4", "primary": "#4ADE80" },
  "levels": [
    {
      "index": 1,
      "pairs": [ {"source": "🦁", "target": "🟥"} ],
      "question": ["🦁"],
      "options": [ ["🟥"], ["🔵"] ],
      "correct": ["🟥"],
      "voiceOver": "Aslan kırmızı kare."
    }
  ],
  "coloring": {
    "templateId": "fish" 
  },
  "vocabulary": [
    { "emoji": "🦁", "english": "Lion" },
    { "emoji": "🐱", "english": "Cat" },
    { "emoji": "🐶", "english": "Dog" },
    { "emoji": "🐘", "english": "Elephant" },
    { "emoji": "🦅", "english": "Eagle" },
    { "emoji": "🐸", "english": "Frog" }
  ]
}
`;

export const FALLBACK_SESSION: GameSession = {
  theme: {
    background: "#F0FFF4", // mint-50
    primary: "#4ADE80", // green-400
  },
  levels: [
    {
      index: 1,
      pairs: [
        { source: "🦁", target: "🥩" }, // Lion -> Meat
        { source: "🐰", target: "🥕" }  // Rabbit -> Carrot
      ],
      question: ["🦁"],
      options: [["🥩"], ["🥕"]],
      correct: ["🥩"],
      voiceOver: "Aslan acıkmış. Aslan ne yer?"
    },
    {
      index: 2,
      pairs: [
        { source: "🐸", target: "🪰" }, // Frog -> Fly
        { source: "🐵", target: "🍌" }, // Monkey -> Banana
        { source: "🐱", target: "🥛" }  // Cat -> Milk
      ],
      question: ["🐸", "🐵"],
      options: [["🪰", "🍌"], ["🥛", "🦴"]], 
      correct: ["🪰", "🍌"],
      voiceOver: "Kurbağa ve maymun ne ister?"
    },
    {
      index: 3,
      pairs: [
        { source: "🐶", target: "🦴" }, // Dog -> Bone
        { source: "🦁", target: "🥩" }, // Reuse Lion
        { source: "🐰", target: "🥬" }  // Reuse Rabbit
      ],
      question: ["🐶", "🦁"],
      options: [["🦴", "🥩"], ["🥬", "🍎"]],
      correct: ["🦴", "🥩"],
      voiceOver: "Köpek ve aslan nerede?"
    },
  ],
  coloring: {
    templateId: "lion"
  },
  vocabulary: [
    { emoji: "🦁", english: "Lion" },
    { emoji: "🐰", english: "Rabbit" },
    { emoji: "🐸", english: "Frog" },
    { emoji: "🐵", english: "Monkey" },
    { emoji: "🐱", english: "Cat" },
    { emoji: "🐶", english: "Dog" }
  ]
};
