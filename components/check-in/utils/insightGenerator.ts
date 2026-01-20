/**
 * Insight Generator for Mood Check-In
 * Generates personalized insights based on user's check-in history
 */

import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs, where, Timestamp } from 'firebase/firestore';

export interface Insight {
    type: 'streak' | 'average' | 'trend' | 'pattern' | 'first' | 'context';
    icon: string;
    message: string;
    priority: number; // Lower = higher priority
}

/**
 * Generate personalized insights based on user's check-in history
 */
export async function generateInsights(userId: string): Promise<Insight[]> {
    if (!db) return [{ type: 'first', icon: '🌱', message: 'This is your first check-in. Keep going to unlock insights.', priority: 99 }];

    try {
        const moodsRef = collection(db, 'users', userId, 'moods');
        const q = query(moodsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const checkIns = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
        }));

        if (checkIns.length === 0) {
            return [{ type: 'first', icon: '🌱', message: 'This is your first check-in. Keep going to unlock insights.', priority: 99 }];
        }

        const insights: Insight[] = [];

        // 1. Calculate streak (highest priority)
        const streak = calculateStreak(checkIns);
        if (streak >= 2) {
            insights.push({
                type: 'streak',
                icon: '📊',
                message: `You've checked in ${streak} ${streak === 2 ? 'day' : 'days'} in a row`,
                priority: 1
            });
        }

        // 2. Calculate weekly average
        const weeklyAvg = calculateWeeklyAverage(checkIns);
        if (weeklyAvg !== null && checkIns.length >= 7) {
            insights.push({
                type: 'average',
                icon: '💜',
                message: `Your average mood this week: ${weeklyAvg}`,
                priority: 2
            });
        }

        // 3. Calculate trend (compare this week to last week)
        const trend = calculateTrend(checkIns);
        if (trend !== null && checkIns.length >= 14) {
            const direction = trend > 0 ? 'up' : 'down';
            const icon = trend > 0 ? '📈' : '📉';
            insights.push({
                type: 'trend',
                icon,
                message: `That's ${direction} from ${Math.abs(trend).toFixed(1)} last week`,
                priority: 3
            });
        }

        // 4. Detect context patterns
        const contextPattern = detectContextPattern(checkIns);
        if (contextPattern) {
            insights.push({
                type: 'context',
                icon: '💡',
                message: `You've mentioned "${contextPattern.factor}" ${contextPattern.count} times this week`,
                priority: 4
            });
        }

        // If no insights, show first check-in message
        if (insights.length === 0) {
            insights.push({
                type: 'first',
                icon: '🌱',
                message: 'Check in regularly to unlock insights.',
                priority: 99
            });
        }

        // Sort by priority and return top 3
        return insights.sort((a, b) => a.priority - b.priority).slice(0, 3);

    } catch (error) {
        console.error('Error generating insights:', error);
        return [{ type: 'first', icon: '🌱', message: 'Keep checking in to unlock insights.', priority: 99 }];
    }
}

/**
 * Calculate current streak (consecutive days with check-ins)
 */
function calculateStreak(checkIns: any[]): number {
    if (checkIns.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get unique check-in dates
    const uniqueDates = [...new Set(checkIns.map(c => {
        const date = new Date(c.createdAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
    }))].sort((a, b) => b - a);

    if (uniqueDates.length === 0) return 0;

    const latestDate = new Date(uniqueDates[0]);

    // Must have checked in today or yesterday to count
    if (latestDate.getTime() !== today.getTime() && latestDate.getTime() !== yesterday.getTime()) {
        return 0;
    }

    let streak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i - 1]);
        const previousDate = new Date(uniqueDates[i]);

        const dayDiff = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}

/**
 * Calculate average mood for the current week
 */
function calculateWeeklyAverage(checkIns: any[]): number | null {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeek = checkIns.filter(c => new Date(c.createdAt) >= weekAgo);

    if (thisWeek.length === 0) return null;

    const sum = thisWeek.reduce((acc, c) => {
        const value = c.moodValue || c.value || c.average || 0;
        return acc + value;
    }, 0);

    return parseFloat((sum / thisWeek.length).toFixed(1));
}

/**
 * Calculate trend (compare this week to last week)
 */
function calculateTrend(checkIns: any[]): number | null {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeek = checkIns.filter(c => new Date(c.createdAt) >= weekAgo);
    const lastWeek = checkIns.filter(c => {
        const date = new Date(c.createdAt);
        return date >= twoWeeksAgo && date < weekAgo;
    });

    if (thisWeek.length === 0 || lastWeek.length === 0) return null;

    const thisWeekAvg = thisWeek.reduce((acc, c) => acc + (c.moodValue || c.value || c.average || 0), 0) / thisWeek.length;
    const lastWeekAvg = lastWeek.reduce((acc, c) => acc + (c.moodValue || c.value || c.average || 0), 0) / lastWeek.length;

    return parseFloat((thisWeekAvg - lastWeekAvg).toFixed(1));
}

/**
 * Detect if user has mentioned a context factor multiple times
 */
function detectContextPattern(checkIns: any[]): { factor: string; count: number } | null {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const thisWeek = checkIns.filter(c => new Date(c.createdAt) >= weekAgo);

    // Count context factors
    const factorCounts: { [key: string]: number } = {};

    thisWeek.forEach(c => {
        const factors = c.contextFactors || [];
        factors.forEach((factor: string) => {
            if (factor !== 'Nothing specific') {
                factorCounts[factor] = (factorCounts[factor] || 0) + 1;
            }
        });
    });

    // Find most common factor (minimum 3 times)
    let maxFactor: string | null = null;
    let maxCount = 0;

    for (const [factor, count] of Object.entries(factorCounts)) {
        if (count >= 3 && count > maxCount) {
            maxFactor = factor;
            maxCount = count;
        }
    }

    return maxFactor ? { factor: maxFactor, count: maxCount } : null;
}

/**
 * Get personalized message based on mood value
 */
export function getPersonalizedMessage(moodValue: number): string {
    if (moodValue <= 3) {
        return `You're at ${moodValue}/10 today. That's okay. You don't have to feel perfect.`;
    } else if (moodValue <= 6) {
        return `You're at ${moodValue}/10 today — not crushing, not collapsing. That's valid.`;
    } else {
        return `You're at ${moodValue}/10 today. That's a good place to be.`;
    }
}
