/**
 * Report Generation Service
 * 
 * Handles generation of pre-therapy, therapy, and self-insight reports
 * as defined in Section 4 of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { getFirstCheckInDate, getCheckInCount } from './checkIn';
import { generateInsights } from './insights';
import type {
    Report,
    ReportContent,
    Theme,
    Pattern,
    Comparison,
    ReportType,
} from '@/lib/models/backend';

// =============================================================================
// REPORT GENERATION
// =============================================================================

/**
 * Generates a new report based on type.
 * Reports are immutable snapshots per v1.0 spec.
 */
export async function generateReport(
    userId: string,
    type: ReportType,
    periodStart?: Date,
    periodEnd?: Date
): Promise<{ success: boolean; reportId?: string; error?: string }> {
    try {
        // Enforce rules for Pre-Therapy Report
        if (type === 'pre_therapy') {
            // 1. One Time Only Rule
            const existingReport = await getLatestReport(userId, 'pre_therapy');
            if (existingReport) {
                return { success: false, error: 'A Pre-Therapy Baseline Report already exists. Please generate a Therapy Report.' };
            }

            // 2. 7-Day Usage Rule
            const firstCheckIn = await getFirstCheckInDate(userId);
            if (!firstCheckIn) {
                return { success: false, error: 'No check-in data found.' };
            }

            const now = new Date();
            const daysSinceFirst = (now.getTime() - firstCheckIn.getTime()) / (1000 * 60 * 60 * 24);

            if (daysSinceFirst < 7) {
                return {
                    success: false,
                    error: `Data too noisy. Please use AARA Prep for ${Math.ceil(7 - daysSinceFirst)} more days to build a stable emotional baseline.`
                };
            }

            // 3. Minimum Signal Rule (3-5 check-ins)
            const checkInCount = await getCheckInCount(userId);
            if (checkInCount < 3) {
                return { success: false, error: 'Need at least 3 check-ins to generate a reliable baseline.' };
            }
        }

        // Set default periods if not provided
        // We use local variables to ensure type safety
        let finalPeriodStart: Date;
        let finalPeriodEnd: Date = periodEnd || new Date();

        if (periodStart) {
            finalPeriodStart = periodStart;
        } else {
            if (type === 'pre_therapy') {
                // Pre-therapy report: From first check-in to now
                const firstCheckIn = await getFirstCheckInDate(userId);
                finalPeriodStart = firstCheckIn || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            } else if (type === 'therapy') {
                // Therapy report: Since last report or last 30 days
                const lastReport = await getLatestReport(userId, 'therapy');
                if (lastReport) {
                    finalPeriodStart = lastReport.periodEnd;
                } else {
                    const d = new Date();
                    d.setDate(d.getDate() - 30);
                    finalPeriodStart = d;
                }
            } else {
                // Self-insight: last 30 days
                const d = new Date();
                d.setDate(d.getDate() - 30);
                finalPeriodStart = d;
            }
        }

        // Generate insights for this period
        const insights = await generateInsights(userId, finalPeriodStart, finalPeriodEnd);

        if (!insights) {
            return { success: false, error: 'Insufficient data to generate report' };
        }

        // Create report content
        const content = await createReportContent(userId, insights, type);

        // Get next version number
        const version = await getNextReportVersion(userId);

        if (!adminDb) {
            return { success: false, error: 'Database not initialized' };
        }

        // Create report document
        const reportRef = adminDb.collection('users').doc(userId).collection('reports').doc();

        const report: Omit<Report, 'id'> = {
            userId,
            type,
            version,
            createdAt: new Date(),
            locked: false, // Will be locked after first save
            periodStart: finalPeriodStart,
            periodEnd: finalPeriodEnd,
            insightIds: [insights.id],
            content,
            shareHistory: [],
        };

        await reportRef.set({
            ...report,
            createdAt: FieldValue.serverTimestamp(),
            periodStart: Timestamp.fromDate(finalPeriodStart),
            periodEnd: Timestamp.fromDate(finalPeriodEnd),
        });

        // Immediately lock the report (immutability)
        await lockReport(reportRef.id, userId);

        // Mark journals as processed if this is a therapy report
        if (type === 'therapy') {
            await markJournalsAsProcessed(userId, finalPeriodStart, finalPeriodEnd, reportRef.id);
        }

        return { success: true, reportId: reportRef.id };
    } catch (error: any) {
        console.error('Error generating report:', error);
        return { success: false, error: error.message || 'Unknown error' };
    }
}

// =============================================================================
// REPORT CONTENT CREATION
// =============================================================================

/**
 * Creates report content from insights.
 */
async function createReportContent(
    userId: string,
    insights: any,
    type: ReportType
): Promise<ReportContent> {
    // Extract themes
    const themes: Theme[] = insights.themes.map((themeName: string) => ({
        name: themeName,
        strength: 0.7, // TODO: calculate actual strength
        description: `Recurring theme: ${themeName}`,
        firstAppearance: insights.createdAt,
    }));

    // Create patterns from emotional patterns and recurrence signals
    const patterns: Pattern[] = [];

    // Add emotional pattern
    patterns.push({
        type: 'emotional',
        description: `Dominant emotions: ${insights.emotionalPatterns.dominant.join(', ')}`,
        frequency: 'daily',
        trend: insights.emotionalPatterns.trend,
    });

    // Add recurrence patterns
    insights.recurrenceSignals.forEach((signal: any) => {
        patterns.push({
            type: 'contextual',
            description: signal.pattern,
            frequency: `${signal.frequency} occurrences`,
            trend: 'recurring',
        });
    });

    // Generate summary (TODO: Use OpenAI for better summarization)
    const summary = `Report for ${insights.timeContext.period}. 
    Average mood: ${insights.emotionalPatterns.intensity}/10. 
    Trend: ${insights.emotionalPatterns.trend}. 
    Main themes: ${insights.themes.slice(0, 3).join(', ')}.`;

    // Create recommendations (user-facing, not medical advice)
    const recommendations = generateRecommendations(insights);

    const content: ReportContent = {
        summary,
        themes,
        patterns,
        recommendations,
    };

    // Add comparison for therapy reports
    if (type === 'therapy') {
        const comparison = await createComparison(userId);
        if (comparison) {
            content.comparison = comparison;
        }
    }

    return content;
}

/**
 * Generates user-facing recommendations (not medical advice).
 */
function generateRecommendations(insights: any): string[] {
    const recommendations: string[] = [];

    // Based on emotional trend
    if (insights.emotionalPatterns.trend === 'declining') {
        recommendations.push('Consider discussing coping strategies with your therapist');
    } else if (insights.emotionalPatterns.trend === 'improving') {
        recommendations.push('Continue with current approaches - they seem to be helping');
    }

    // Based on recurrence signals
    if (insights.recurrenceSignals.length > 2) {
        recommendations.push('Notice recurring patterns - these may be valuable discussion points');
    }

    // Based on intensity
    if (insights.emotionalPatterns.intensity < 4) {
        recommendations.push('Low mood detected - prioritize self-care and support');
    }

    return recommendations;
}

// =============================================================================
// COMPARISON LOGIC
// =============================================================================

/**
 * Creates comparison data between current and baseline report.
 */
async function createComparison(userId: string): Promise<Comparison | null> {
    try {
        // Get baseline report (first pre-therapy or therapy report)
        const baselineReport = await getLatestReport(userId, 'pre_therapy');

        if (!baselineReport) {
            return null; // No baseline to compare against
        }

        // TODO: Implement actual comparison logic
        // For now, returning a placeholder
        return {
            baselineReportId: baselineReport.id,
            changes: [
                {
                    metric: 'average_mood',
                    direction: 'stable',
                    magnitude: 0.1,
                },
            ],
        };
    } catch (error) {
        console.error('Error creating comparison:', error);
        return null;
    }
}

// =============================================================================
// REPORT LOCKING & IMMUTABILITY
// =============================================================================

/**
 * Locks a report to make it immutable.
 */
export async function lockReport(reportId: string, userId: string): Promise<void> {
    try {
        if (!adminDb) return;

        const reportRef = adminDb.collection('users').doc(userId).collection('reports').doc(reportId);
        await reportRef.update({ locked: true });
    } catch (error) {
        console.error('Error locking report:', error);
    }
}

// =============================================================================
// JOURNAL PROCESSING
// =============================================================================

/**
 * Marks journals as processed in a report (one-time processing rule).
 */
async function markJournalsAsProcessed(
    userId: string,
    periodStart: Date,
    periodEnd: Date,
    reportId: string
): Promise<void> {
    try {
        if (!adminDb) return;

        const journalsRef = adminDb.collection('users').doc(userId).collection('journal');

        const snapshot = await journalsRef
            .where('includeInReport', '==', true)
            .where('processed', '==', false)
            .get();

        const batch = adminDb.batch();

        snapshot.docs.forEach((doc) => {
            const createdAt = doc.data().createdAt?.toDate();
            if (createdAt && createdAt >= periodStart && createdAt <= periodEnd) {
                batch.update(doc.ref, {
                    processed: true,
                    processedAt: FieldValue.serverTimestamp(),
                    processedInReportId: reportId,
                });
            }
        });

        await batch.commit();
    } catch (error) {
        console.error('Error marking journals as processed:', error);
    }
}

// =============================================================================
// REPORT RETRIEVAL
// =============================================================================

/**
 * Gets a specific report by ID.
 */
export async function getReport(userId: string, reportId: string): Promise<Report | null> {
    try {
        if (!adminDb) return null;

        const reportRef = adminDb.collection('users').doc(userId).collection('reports').doc(reportId);
        const reportDoc = await reportRef.get();

        if (!reportDoc.exists) {
            return null;
        }

        const data = reportDoc.data();
        return {
            id: reportDoc.id,
            userId: data?.userId,
            type: data?.type,
            version: data?.version,
            createdAt: data?.createdAt?.toDate() || new Date(),
            locked: data?.locked || false,
            periodStart: data?.periodStart?.toDate?.() || (typeof data?.periodStart === 'string' ? new Date(data.periodStart) : new Date()),
            periodEnd: data?.periodEnd?.toDate?.() || (typeof data?.periodEnd === 'string' ? new Date(data.periodEnd) : new Date()),
            insightIds: data?.insightIds || [],
            content: data?.content || {},
            shareHistory: data?.shareHistory || [],
        } as Report;
    } catch (error) {
        console.error('Error getting report:', error);
        return null;
    }
}

/**
 * Gets all reports for a user.
 */
export async function getUserReports(userId: string): Promise<Report[]> {
    try {
        if (!adminDb) return [];

        const reportsRef = adminDb.collection('users').doc(userId).collection('reports');
        const snapshot = await reportsRef.orderBy('createdAt', 'desc').get();

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type,
                version: data.version,
                createdAt: data.createdAt?.toDate() || new Date(),
                locked: data.locked || false,
                periodStart: data.periodStart?.toDate?.() || (typeof data.periodStart === 'string' ? new Date(data.periodStart) : new Date()),
                periodEnd: data.periodEnd?.toDate?.() || (typeof data.periodEnd === 'string' ? new Date(data.periodEnd) : new Date()),
                insightIds: data.insightIds || [],
                content: data.content || {},
                shareHistory: data.shareHistory || [],
            } as Report;
        });
    } catch (error) {
        console.error('Error getting user reports:', error);
        return [];
    }
}

/**
 * Gets the latest report of a specific type.
 */
async function getLatestReport(userId: string, type: ReportType): Promise<Report | null> {
    try {
        if (!adminDb) return null;

        const reportsRef = adminDb.collection('users').doc(userId).collection('reports');
        const snapshot = await reportsRef
            .where('type', '==', type)
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return null;
        }

        const doc = snapshot.docs[0];
        const data = doc.data();

        return {
            id: doc.id,
            userId: data.userId,
            type: data.type,
            version: data.version,
            createdAt: data.createdAt?.toDate() || new Date(),
            locked: data.locked || false,
            periodStart: data.periodStart?.toDate?.() || (typeof data.periodStart === 'string' ? new Date(data.periodStart) : new Date()),
            periodEnd: data.periodEnd?.toDate?.() || (typeof data.periodEnd === 'string' ? new Date(data.periodEnd) : new Date()),
            insightIds: data.insightIds || [],
            content: data.content || {},
            shareHistory: data.shareHistory || [],
        } as Report;
    } catch (error) {
        console.error('Error getting latest report:', error);
        return null;
    }
}

// =============================================================================
// VERSIONING
// =============================================================================

/**
 * Gets the next version number for reports.
 */
async function getNextReportVersion(userId: string): Promise<number> {
    try {
        if (!adminDb) return 1;

        const reportsRef = adminDb.collection('users').doc(userId).collection('reports');
        const snapshot = await reportsRef.orderBy('version', 'desc').limit(1).get();

        if (snapshot.empty) {
            return 1;
        }

        const latestVersion = snapshot.docs[0].data().version || 0;
        return latestVersion + 1;
    } catch (error) {
        console.error('Error getting next version:', error);
        return 1;
    }
}
