/**
 * Rotation Logic for Mood Check-In
 * Ensures prompts and emotion words vary daily to prevent check-in fatigue
 */

// Mood prompt variations
const MOOD_PROMPTS = [
    "How heavy is your mental load right now?",
    "How are you feeling today?",
    "What's your mental state right now?",
    "How's your mind feeling?",
    "Check in: How are you doing?"
];

// Emotion word bank (categorized for balanced selection)
export const EMOTION_WORDS = {
    positive: ['Calm', 'Grateful', 'Hopeful', 'Energized', 'Peaceful', 'Content', 'Joyful'],
    neutral: ['Tired', 'Numb', 'Distracted', 'Meh', 'Foggy', 'Restless'],
    negative: ['Anxious', 'Overwhelmed', 'Frustrated', 'Lonely', 'Stressed', 'Sad', 'Angry', 'Drained']
};

// Context factor options
const CONTEXT_OPTIONS = [
    'Work stress',
    'Sleep issues',
    'Relationship tension',
    'Financial worry',
    'Health concerns',
    'Loneliness',
    'Family stress',
    'Social anxiety',
    'Body image',
    'Nothing specific'
];

/**
 * Get daily mood prompt based on current date
 * Uses day of year to ensure same prompt all day but varies each day
 */
export function getDailyMoodPrompt(): string {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));

    const index = dayOfYear % MOOD_PROMPTS.length;
    return MOOD_PROMPTS[index];
}

/**
 * Get 6-9 random emotion words (mix of positive, neutral, negative)
 * Ensures balanced selection and variety
 */
export function getDailyEmotionWords(): string[] {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    // Seeded random to ensure same words all day
    const seededRandom = (min: number, max: number) => {
        const x = Math.sin(seed + min + max) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    // Shuffle helper
    const shuffle = <T,>(array: T[], randomizer: (min: number, max: number) => number): T[] => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = randomizer(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Get 2-3 from each category
    const positiveWords = shuffle(EMOTION_WORDS.positive, seededRandom).slice(0, 3);
    const neutralWords = shuffle(EMOTION_WORDS.neutral, seededRandom).slice(0, 2);
    const negativeWords = shuffle(EMOTION_WORDS.negative, seededRandom).slice(0, 3);

    // Combine and shuffle final set
    const allWords = [...positiveWords, ...neutralWords, ...negativeWords];
    return shuffle(allWords, seededRandom).slice(0, 8); // Return 8 words
}

/**
 * Get 6-7 context options to display (always includes "Nothing specific")
 */
export function getDailyContextOptions(): string[] {
    const now = new Date();
    const seed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();

    const seededRandom = (min: number, max: number) => {
        const x = Math.sin(seed + min + max) * 10000;
        return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
    };

    const shuffle = <T,>(array: T[]): T[] => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = seededRandom(0, i);
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Remove "Nothing specific" from options, shuffle, take 6, then add it back at end
    const withoutNothingSpecific = CONTEXT_OPTIONS.filter(opt => opt !== 'Nothing specific');
    const shuffled = shuffle(withoutNothingSpecific).slice(0, 6);

    return [...shuffled, 'Nothing specific'];
}

/**
 * Store last shown values in localStorage to track what user has seen
 * (Optional enhancement - can be implemented later)
 */
export function trackShownPrompt(prompt: string) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('lastMoodPrompt', prompt);
    }
}

export function trackShownEmotionWords(words: string[]) {
    if (typeof window !== 'undefined') {
        localStorage.setItem('lastEmotionWords', JSON.stringify(words));
    }
}
