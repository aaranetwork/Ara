/**
 * AARA Backend Data Models - v1.0
 * 
 * These TypeScript interfaces define the complete backend data architecture
 * as specified in aara_backend_architecture.md v1.0
 * 
 * AUTHORITY: This file is the single source of truth for all backend data structures.
 * Any changes must align with the v1.0 specification.
 */

// =============================================================================
// USER STATE MANAGEMENT
// =============================================================================

export type UserStateType = 'exploration' | 'preparing' | 'in_therapy' | 'maintenance';

export interface UserState {
    userId: string;
    state: UserStateType;
    stateChangedAt: Date;
    stateHistory: StateChange[];
    lastCheckInDate: Date | null;
    checkInLevel: number; // Progressive depth (starts at 1)
}

export interface StateChange {
    fromState: UserStateType | null; // null for initial state
    toState: UserStateType;
    changedAt: Date;
    triggerType: 'user_action' | 'system_suggestion';
    userConfirmed: boolean;
    reason?: string; // Optional explanation for the transition
}

// =============================================================================
// CHECK-IN SYSTEM
// =============================================================================

export interface CheckIn {
    id: string;
    userId: string;
    createdAt: Date;
    level: number; // Progressive question depth (1, 2, 3, etc.)
    responses: CheckInResponses;
    processed: boolean; // Has this been included in insight generation?
    processedAt: Date | null;
}

export interface CheckInResponses {
    emotionalIntensity: number; // 1-10 scale (moodValue)
    emotionalCategory: string[]; // e.g., ['Anxious', 'Tired']
    contextFlag: string[]; // e.g., ['Work stress', 'Sleep issues']
}

// =============================================================================
// JOURNAL SYSTEM
// =============================================================================

export interface Journal {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    title?: string;
    content: string; // Encrypted at rest
    category?: string;
    isOneLine?: boolean;

    // Consent & Processing Fields (New in v1.0)
    includeInReport: boolean; // Default: false (private by default)
    consentGivenAt: Date | null;
    processed: boolean; // Has this journal been processed in a report?
    processedAt: Date | null;
    processedInReportId: string | null; // One-time link to the report that used it
}

// =============================================================================
// CHAT SYSTEM
// =============================================================================

export interface ChatSummary {
    id: string;
    userId: string;
    sessionId: string;
    createdAt: Date;
    summary: string; // Already summarized, not raw chat content
    processed: boolean;
    processedAt: Date | null;
}

// =============================================================================
// INSIGHT PROCESSING
// =============================================================================

export interface Insight {
    id: string;
    userId: string;
    createdAt: Date;
    sources: InsightSource[]; // References to check-ins, journals, chats
    themes: string[]; // Extracted themes (e.g., "Work-life balance struggle")
    emotionalPatterns: EmotionalPattern;
    recurrenceSignals: RecurrenceSignal[];
    timeContext: TimeContext;
}

export interface InsightSource {
    type: 'check_in' | 'journal' | 'chat_summary';
    id: string; // Reference to the source document ID
    weight: number; // Contribution to insight (0-1 scale)
}

export interface EmotionalPattern {
    dominant: string[]; // Most frequent emotions
    intensity: number; // Average intensity (1-10)
    trend: 'improving' | 'stable' | 'declining' | 'volatile';
}

export interface RecurrenceSignal {
    pattern: string; // Description of recurring theme
    frequency: number; // How many times observed
    firstSeen: Date;
    lastSeen: Date;
}

export interface TimeContext {
    period: string; // e.g., "Last 7 days", "Jan 1 - Jan 15"
    significantDates: Date[]; // Dates with notable events/check-ins
}

// =============================================================================
// REPORT GENERATION
// =============================================================================

export type ReportType = 'pre_therapy' | 'therapy' | 'self_insight';

export interface Report {
    id: string;
    userId: string;
    type: ReportType;
    version: number; // Report version (increments for each new report)
    createdAt: Date;
    locked: boolean; // Immutable after creation
    periodStart: Date;
    periodEnd: Date;
    insightIds: string[]; // References to insights (not copies)
    content: ReportContent;
    shareHistory: ShareRecord[];
}

export interface ReportContent {
    summary: string; // Overall summary for this period
    themes: Theme[];
    patterns: Pattern[];
    recommendations: string[]; // User-facing suggestions (not medical advice)
    comparison?: Comparison; // Only for therapy reports (vs baseline)
}

export interface Theme {
    name: string; // e.g., "Career uncertainty"
    strength: number; // 0-1 scale
    description: string; // AI-generated description
    firstAppearance: Date;
}

export interface Pattern {
    type: string; // e.g., "emotional", "behavioral", "contextual"
    description: string;
    frequency: string; // e.g., "daily", "3x per week"
    trend: string; // e.g., "increasing", "stable", "decreasing"
}

export interface Comparison {
    baselineReportId: string; // Reference to previous report
    changes: ComparisonChange[];
}

export interface ComparisonChange {
    metric: string; // What changed (e.g., "average mood", "anxiety frequency")
    direction: 'improved' | 'stable' | 'declined';
    magnitude: number; // 0-1 scale
}

// =============================================================================
// SHARING SYSTEM
// =============================================================================

export interface ShareRecord {
    id: string;
    reportId: string;
    sharedAt: Date;
    shareMethod: 'pdf' | 'secure_link';
    recipientType: 'therapist'; // Future: could expand to 'trusted_contact', etc.
    accessToken: string | null; // For secure links
    revokedAt: Date | null;
    accessedAt: Date | null; // When the link was first accessed
    accessCount: number; // How many times accessed
}

// =============================================================================
// CONSENT LOGGING
// =============================================================================

export interface ConsentLog {
    id: string;
    userId: string;
    timestamp: Date;
    action: 'grant' | 'revoke';
    resourceType: 'journal' | 'quote' | 'report_share';
    resourceId: string; // ID of the journal, quote, or report
    purpose: string; // Why consent was requested (e.g., "Include in therapy report")
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Common API response wrapper
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> {
    data: T[];
    meta: PaginationMeta;
}
