/**
 * Insight Processing Engine
 * 
 * Processes raw data (check-ins, journals, chat summaries) into structured insights
 * as defined in Section 3.5 of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getUnprocessedCheckIns, markCheckInsAsProcessed } from './checkIn';
import type {
    Insight,
    InsightSource,
    EmotionalPattern,
    RecurrenceSignal,
    TimeContext,
    Journal,
    ChatSummary,
} from '@/lib/models/backend';

// =============================================================================
// INSIGHT GENERATION
// =============================================================================

/**
 * Generates insights from available data sources (check-ins, journals, chats).
 * This is called during report generation or real-time insight viewing.
 */
export async function generateInsights(
    userId: string,
    periodStart: Date,
    periodEnd: Date
): Promise<Insight | null> {
    try {
        // Gather all data sources
        const checkIns = await getUnprocessedCheckIns(userId);
        const journals = await getConsentedJournals(userId, periodStart, periodEnd);
        const chatSummaries = await getChatSummaries(userId, periodStart, periodEnd);

        if (checkIns.length === 0 && journals.length === 0 && chatSummaries.length === 0) {
            return null; // No data to process
        }

        // Create insight sources with weights
        const sources: InsightSource[] = [];

        // Add check-ins (weight based on frequency)
        checkIns.forEach((checkIn) => {
            sources.push({
                type: 'check_in',
                id: checkIn.id,
                weight: 0.5, // Base weight for check-ins
            });
        });

        // Add journals (higher weight due to depth of content)
        journals.forEach((journal) => {
            sources.push({
                type: 'journal',
                id: journal.id,
                weight: 0.8, // Higher weight for journals
            });
        });

        // Add chat summaries (medium weight)
        chatSummaries.forEach((chat) => {
            sources.push({
                type: 'chat_summary',
                id: chat.id,
                weight: 0.6, // Medium weight for chat summaries
            });
        });

        // Extract themes using AI
        const themes = await extractThemes(checkIns, journals, chatSummaries);

        // Analyze emotional patterns
        const emotionalPatterns = analyzeEmotionalPatterns(checkIns);

        // Detect recurrence signals
        const recurrenceSignals = detectRecurrenceSignals(checkIns, journals);

        // Create time context
        const timeContext: TimeContext = {
            period: `${periodStart.toLocaleDateString()} - ${periodEnd.toLocaleDateString()}`,
            significantDates: checkIns.map((c) => c.createdAt),
        };

        if (!adminDb) return null;

        // Create insight document
        const insightRef = adminDb.collection('users').doc(userId).collection('insights').doc();

        const insight: Omit<Insight, 'id'> = {
            userId,
            createdAt: new Date(),
            sources,
            themes,
            emotionalPatterns,
            recurrenceSignals,
            timeContext,
        };

        await insightRef.set({
            ...insight,
            createdAt: FieldValue.serverTimestamp(),
        });

        return { id: insightRef.id, ...insight };
    } catch (error) {
        console.error('Error generating insights:', error);
        return null;
    }
}

// =============================================================================
// DATA RETRIEVAL
// =============================================================================

/**
 * Gets consented journals within a date range that haven't been processed yet.
 */
async function getConsentedJournals(
    userId: string,
    periodStart: Date,
    periodEnd: Date
): Promise<Journal[]> {
    try {
        if (!adminDb) return [];

        const journalsRef = adminDb.collection('users').doc(userId).collection('journal');

        const snapshot = await journalsRef
            .where('includeInReport', '==', true)
            .where('processed', '==', false)
            .get();

        const journals: Journal[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate() || new Date();

            // Filter by date range
            if (createdAt >= periodStart && createdAt <= periodEnd) {
                journals.push({
                    id: doc.id,
                    userId: data.userId,
                    createdAt,
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                    title: data.title,
                    content: data.content,
                    category: data.category,
                    isOneLine: data.isOneLine,
                    includeInReport: data.includeInReport,
                    consentGivenAt: data.consentGivenAt?.toDate() || null,
                    processed: data.processed || false,
                    processedAt: data.processedAt?.toDate() || null,
                    processedInReportId: data.processedInReportId || null,
                });
            }
        });

        return journals;
    } catch (error) {
        console.error('Error getting consented journals:', error);
        return [];
    }
}

/**
 * Gets chat summaries within a date range.
 */
async function getChatSummaries(
    userId: string,
    periodStart: Date,
    periodEnd: Date
): Promise<ChatSummary[]> {
    try {
        if (!adminDb) return [];

        const chatsRef = adminDb.collection('chats');

        const snapshot = await chatsRef
            .where('userId', '==', userId)
            .where('summary', '!=', null)
            .get();

        const summaries: ChatSummary[] = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate() || new Date();

            // Filter by date range
            if (createdAt >= periodStart && createdAt <= periodEnd) {
                summaries.push({
                    id: doc.id,
                    userId: data.userId,
                    sessionId: doc.id,
                    createdAt,
                    summary: data.summary,
                    processed: data.processed || false,
                    processedAt: data.processedAt?.toDate() || null,
                });
            }
        });

        return summaries;
    } catch (error) {
        console.error('Error getting chat summaries:', error);
        return [];
    }
}

// =============================================================================
// AI-POWERED THEME EXTRACTION
// =============================================================================

/**
 * Extracts themes from raw data using OpenAI.
 * This abstracts personal content into generalized themes per v1.0 spec.
 */
async function extractThemes(
    checkIns: any[],
    journals: Journal[],
    chatSummaries: ChatSummary[]
): Promise<string[]> {
    try {
        // Aggregate data for AI processing (without exposing raw journal content)
        const checkInEmotions = checkIns.flatMap((c) => c.responses.emotionalCategory);
        const checkInContexts = checkIns.flatMap((c) => c.responses.contextFlag);
        const chatThemes = chatSummaries.map((c) => c.summary); // Summaries are already abstracted

        // For journals, we'll extract keywords/themes without exposing full content
        // In production, this would call OpenAI to extract themes
        // For now, using a simple keyword-based approach

        const allThemes = new Set<string>();

        // Add emotions as themes
        checkInEmotions.forEach((emotion) => allThemes.add(emotion));

        // Add contexts as themes
        checkInContexts.forEach((context) => allThemes.add(context));

        // TODO: Integrate OpenAI API for deeper theme extraction
        // Example structure (not implemented yet):
        // const themes = await callOpenAI({
        //   prompt: 'Extract recurring themes from this user data...',
        //   data: { checkInSummary, chatSummaries, journalCount }
        // });

        return Array.from(allThemes).slice(0, 10); // Limit to top 10 themes
    } catch (error) {
        console.error('Error extracting themes:', error);
        return [];
    }
}

// =============================================================================
// EMOTIONAL PATTERN ANALYSIS
// =============================================================================

/**
 * Analyzes emotional patterns from check-ins.
 */
function analyzeEmotionalPatterns(checkIns: any[]): EmotionalPattern {
    if (checkIns.length === 0) {
        return {
            dominant: [],
            intensity: 5,
            trend: 'stable',
        };
    }

    // Calculate dominant emotions
    const emotionCount: Record<string, number> = {};
    checkIns.forEach((checkIn) => {
        checkIn.responses.emotionalCategory.forEach((emotion: string) => {
            emotionCount[emotion] = (emotionCount[emotion] || 0) + 1;
        });
    });

    const dominant = Object.entries(emotionCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion);

    // Calculate average intensity
    const totalIntensity = checkIns.reduce(
        (sum, checkIn) => sum + (checkIn.responses.emotionalIntensity || 0),
        0
    );
    const intensity = Math.round(totalIntensity / checkIns.length);

    // Determine trend
    const trend = calculateTrend(checkIns);

    return { dominant, intensity, trend };
}

/**
 * Calculates emotional trend (improving/stable/declining/volatile).
 */
function calculateTrend(checkIns: any[]): 'improving' | 'stable' | 'declining' | 'volatile' {
    if (checkIns.length < 3) return 'stable';

    const intensities = checkIns.map((c) => c.responses.emotionalIntensity);
    const firstHalf = intensities.slice(0, Math.floor(intensities.length / 2));
    const secondHalf = intensities.slice(Math.floor(intensities.length / 2));

    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

    // Calculate volatility (standard deviation)
    const mean = intensities.reduce((sum, val) => sum + val, 0) / intensities.length;
    const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev > 2.5) return 'volatile';
    if (secondAvg > firstAvg + 1) return 'improving';
    if (secondAvg < firstAvg - 1) return 'declining';
    return 'stable';
}

// =============================================================================
// RECURRENCE DETECTION
// =============================================================================

/**
 * Detects recurring patterns across check-ins and journals.
 */
function detectRecurrenceSignals(checkIns: any[], journals: Journal[]): RecurrenceSignal[] {
    const signals: RecurrenceSignal[] = [];

    // Detect recurring contexts
    const contextCount: Record<string, { count: number; firstSeen: Date; lastSeen: Date }> = {};

    checkIns.forEach((checkIn) => {
        checkIn.responses.contextFlag.forEach((context: string) => {
            if (!contextCount[context]) {
                contextCount[context] = {
                    count: 1,
                    firstSeen: checkIn.createdAt,
                    lastSeen: checkIn.createdAt,
                };
            } else {
                contextCount[context].count++;
                contextCount[context].lastSeen = checkIn.createdAt;
            }
        });
    });

    // Add significant recurring patterns (frequency >= 3)
    Object.entries(contextCount).forEach(([pattern, data]) => {
        if (data.count >= 3) {
            signals.push({
                pattern,
                frequency: data.count,
                firstSeen: data.firstSeen,
                lastSeen: data.lastSeen,
            });
        }
    });

    return signals;
}

// =============================================================================
// INSIGHT RETRIEVAL
// =============================================================================

/**
 * Gets a specific insight by ID.
 */
export async function getInsight(userId: string, insightId: string): Promise<Insight | null> {
    try {
        if (!adminDb) return null;

        const insightRef = adminDb.collection('users').doc(userId).collection('insights').doc(insightId);
        const insightDoc = await insightRef.get();

        if (!insightDoc.exists) {
            return null;
        }

        const data = insightDoc.data();
        return {
            id: insightDoc.id,
            userId: data?.userId,
            createdAt: data?.createdAt?.toDate() || new Date(),
            sources: data?.sources || [],
            themes: data?.themes || [],
            emotionalPatterns: data?.emotionalPatterns || {},
            recurrenceSignals: data?.recurrenceSignals || [],
            timeContext: data?.timeContext || {},
        } as Insight;
    } catch (error) {
        console.error('Error getting insight:', error);
        return null;
    }
}

/**
 * Gets all insights for a user.
 */
export async function getUserInsights(userId: string): Promise<Insight[]> {
    try {
        if (!adminDb) return [];

        const insightsRef = adminDb.collection('users').doc(userId).collection('insights');
        const snapshot = await insightsRef.orderBy('createdAt', 'desc').get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                createdAt: data.createdAt?.toDate() || new Date(),
                sources: data.sources || [],
                themes: data.themes || [],
                emotionalPatterns: data.emotionalPatterns || {},
                recurrenceSignals: data.recurrenceSignals || [],
                timeContext: data.timeContext || {},
            } as Insight;
        });
    } catch (error) {
        console.error('Error getting user insights:', error);
        return [];
    }
}
