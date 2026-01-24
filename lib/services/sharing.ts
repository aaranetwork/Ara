/**
 * Sharing Service
 * 
 * Handles PDF generation and secure link sharing for reports
 * as defined in Section 3.6 and Phase 3of aara_backend_architecture.md v1.0
 */

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { getReport } from './reports';
import type { ShareRecord } from '@/lib/models/backend';
import crypto from 'crypto';

// =============================================================================
// SHARE CREATION
// =============================================================================

/**
 * Creates a share record for a report (PDF or secure link).
 */
export async function createShare(
  userId: string,
  reportId: string,
  shareMethod: 'pdf' | 'secure_link',
  recipientType: 'therapist' = 'therapist'
): Promise<{ success: boolean; shareId?: string; accessToken?: string; error?: string }> {
  try {
    // Get the report to ensure it exists
    const report = await getReport(userId, reportId);

    if (!report) {
      return { success: false, error: 'Report not found' };
    }

    // Generate secure access token for secure links
    const accessToken = shareMethod === 'secure_link'
      ? generateSecureToken()
      : null;

    if (!adminDb) {
      return { success: false, error: 'Database not initialized' };
    }

    // Create share record
    const shareRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId)
      .collection('shares')
      .doc();

    const shareRecord: Omit<ShareRecord, 'id' | 'reportId'> = {
      sharedAt: new Date(),
      shareMethod,
      recipientType,
      accessToken,
      revokedAt: null,
      accessedAt: null,
      accessCount: 0,
    };

    await shareRef.set({
      ...shareRecord,
      sharedAt: FieldValue.serverTimestamp(),
    });

    // Also add to report's shareHistory array (for quick access)
    const reportRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId);

    await reportRef.update({
      shareHistory: FieldValue.arrayUnion({
        id: shareRef.id,
        ...shareRecord,
        sharedAt: FieldValue.serverTimestamp(),
      }),
    });

    return {
      success: true,
      shareId: shareRef.id,
      accessToken: accessToken || undefined,
    };
  } catch (error: any) {
    console.error('Error creating share:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

// =============================================================================
// SHARE VALIDATION
// =============================================================================

/**
 * Validates a share access token and returns the report if valid.
 */
export async function validateShareToken(token: string): Promise<{
  valid: boolean;
  userId?: string;
  reportId?: string;
  shareId?: string;
  error?: string;
}> {
  try {
    if (!adminDb) {
      return { valid: false, error: 'Database not initialized' };
    }

    // Search for the share record with this token
    // Note: This is a simple implementation; in production, consider indexing tokens
    const usersRef = adminDb.collection('users');
    const usersSnapshot = await usersRef.get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const reportsRef = userDoc.ref.collection('reports');
      const reportsSnapshot = await reportsRef.get();

      for (const reportDoc of reportsSnapshot.docs) {
        const reportId = reportDoc.id;
        const sharesRef = reportDoc.ref.collection('shares');
        const sharesSnapshot = await sharesRef.where('accessToken', '==', token).get();

        if (!sharesSnapshot.empty) {
          const shareDoc = sharesSnapshot.docs[0];
          const shareData = shareDoc.data();

          // Check if revoked
          if (shareData.revokedAt) {
            return {
              valid: false,
              error: 'This share link has been revoked',
            };
          }

          // Valid share found!
          // Log access
          await logShareAccess(shareDoc.id, userId, reportId);

          return {
            valid: true,
            userId,
            reportId,
            shareId: shareDoc.id,
          };
        }
      }
    }

    return {
      valid: false,
      error: 'Invalid or expired share link',
    };
  } catch (error: any) {
    console.error('Error validating share token:', error);
    return {
      valid: false,
      error: 'Internal server error',
    };
  }
}

// =============================================================================
// SHARE REVOCATION
// =============================================================================

/**
 * Revokes a share (user can no longer access via link).
 */
export async function revokeShare(
  userId: string,
  reportId: string,
  shareId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!adminDb) {
      return { success: false, error: 'Database not initialized' };
    }

    const shareRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId)
      .collection('shares')
      .doc(shareId);

    await shareRef.update({
      revokedAt: FieldValue.serverTimestamp(),
    });

    // Also update in report's shareHistory
    const reportRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId);

    const reportDoc = await reportRef.get();
    const shareHistory = reportDoc.data()?.shareHistory || [];

    const updatedHistory = shareHistory.map((share: any) => {
      if (share.id === shareId) {
        return { ...share, revokedAt: FieldValue.serverTimestamp() };
      }
      return share;
    });

    await reportRef.update({ shareHistory: updatedHistory });

    return { success: true };
  } catch (error: any) {
    console.error('Error revoking share:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Revokes all shares for a user (e.g., on account deletion).
 */
export async function revokeAllShares(userId: string): Promise<{ success: boolean; count: number }> {
  try {
    if (!adminDb) {
      return { success: false, count: 0 };
    }

    let totalRevoked = 0;

    // Get all reports for user
    const reportsRef = adminDb.collection('users').doc(userId).collection('reports');
    const reportsSnapshot = await reportsRef.get();

    for (const reportDoc of reportsSnapshot.docs) {
      const sharesRef = reportDoc.ref.collection('shares');
      const sharesSnapshot = await sharesRef.where('revokedAt', '==', null).get();

      const batch = adminDb.batch();

      sharesSnapshot.docs.forEach((shareDoc) => {
        batch.update(shareDoc.ref, { revokedAt: FieldValue.serverTimestamp() });
        totalRevoked++;
      });

      await batch.commit();
    }

    return { success: true, count: totalRevoked };
  } catch (error) {
    console.error('Error revoking all shares:', error);
    return { success: false, count: 0 };
  }
}

// =============================================================================
// ACCESS LOGGING
// =============================================================================

/**
 * Logs when a share link is accessed.
 */
async function logShareAccess(shareId: string, userId: string, reportId: string): Promise<void> {
  try {
    if (!adminDb) return;

    const shareRef = adminDb
      .collection('users')
      .doc(userId)
      .collection('reports')
      .doc(reportId)
      .collection('shares')
      .doc(shareId);

    const shareDoc = await shareRef.get();
    const shareData = shareDoc.data();

    // Update access count and timestamp
    await shareRef.update({
      accessCount: (shareData?.accessCount || 0) + 1,
      accessedAt: shareData?.accessedAt || FieldValue.serverTimestamp(), // Only set first access time
    });
  } catch (error) {
    console.error('Error logging share access:', error);
  }
}

// =============================================================================
// PDF GENERATION
// =============================================================================

/**
 * Generates a PDF for a report using Puppeteer.
 */
export async function generatePDF(
  userId: string,
  reportId: string
): Promise<{ success: boolean; pdfUrl?: string; error?: string }> {
  try {
    const report = await getReport(userId, reportId);

    if (!report) {
      return { success: false, error: 'Report not found' };
    }

    // Generate HTML template
    const html = renderReportHTML(report);

    // Use Puppeteer to generate PDF
    const puppeteer = (await import('puppeteer')).default;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Generate PDF with professional settings
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '15mm',
        right: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width: 100%; font-size: 8px; text-align: center; color: #666; padding: 10px;">
          <span class="pageNumber"></span> / <span class="totalPages"></span>
        </div>
      `,
    });

    await browser.close();

    // Upload to Firebase Storage (if configured)
    // For now, return a base64 data URL as fallback
    const base64PDF = Buffer.from(pdfBuffer).toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64PDF}`;

    // TODO: Upload to Firebase Storage and generate signed URL
    // const storage = new Storage();
    // const bucket = storage.bucket(process.env.FIREBASE_STORAGE_BUCKET!);
    // const fileName = `reports/${userId}/${reportId}_${Date.now()}.pdf`;
    // const file = bucket.file(fileName);
    // await file.save(pdfBuffer, { metadata: { contentType: 'application/pdf' } });
    // const [signedUrl] = await file.getSignedUrl({ action: 'read', expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });

    return {
      success: true,
      pdfUrl: dataUrl, // Use data URL for now; replace with signedUrl when Storage is configured
    };
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

/**
 * Renders report as HTML for PDF generation.
 */
function renderReportHTML(report: any): string {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid #4F46E5;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #4F46E5;
          margin-bottom: 10px;
        }
        .report-type {
          display: inline-block;
          padding: 8px 16px;
          background: #EEF2FF;
          color: #4F46E5;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 10px;
          color: #1F2937;
        }
        .period {
          font-size: 14px;
          color: #6B7280;
          margin-bottom: 5px;
        }
        .generated {
          font-size: 12px;
          color: #9CA3AF;
        }
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #1F2937;
          border-bottom: 1px solid #E5E7EB;
          padding-bottom: 8px;
        }
        .summary {
          background: #F9FAFB;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #4F46E5;
        }
        .theme-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
        }
        .theme-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .theme-name {
          font-weight: 600;
          font-size: 16px;
          color: #1F2937;
        }
        .theme-strength {
          font-size: 14px;
          color: #6B7280;
        }
        .theme-desc {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.5;
        }
        .pattern-card {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 12px;
        }
        .pattern-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          flex-wrap: wrap;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          background: #EEF2FF;
          color: #4F46E5;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        .recommendations {
          background: #EFF6FF;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #3B82F6;
        }
        .recommendations ul {
          list-style: none;
          padding-left: 0;
        }
        .recommendations li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .recommendations li:before {
          content: "•";
          position: absolute;
          left: 8px;
          color: #3B82F6;
          font-weight: bold;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
          text-align: center;
          font-size: 11px;
          color: #6B7280;
        }
        .disclaimer {
          background: #FEF3C7;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
          font-size: 10px;
          line-height: 1.5;
        }
        @media print {
          body { padding: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">AARA</div>
        <div class="report-type">${report.type.replace('_', ' ')}</div>
        <h1>Clinical Insight Report</h1>
        <div class="period">${formatDate(report.periodStart)} - ${formatDate(report.periodEnd)}</div>
        <div class="generated">Generated ${formatDate(report.createdAt)} · Version ${report.version}</div>
      </div>

      <div class="section">
        <div class="section-title">Summary</div>
        <div class="summary">
          ${report.content.summary}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Recurring Themes</div>
        ${report.content.themes.map((theme: any) => `
          <div class="theme-card">
            <div class="theme-header">
              <div class="theme-name">${theme.name}</div>
              <div class="theme-strength">${Math.round(theme.strength * 100)}%</div>
            </div>
            <div class="theme-desc">${theme.description}</div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Observed Patterns</div>
        ${report.content.patterns.map((pattern: any) => `
          <div class="pattern-card">
            <div class="pattern-meta">
              <span class="badge">${pattern.type}</span>
              <span class="badge">${pattern.frequency}</span>
              <span class="badge">${pattern.trend}</span>
            </div>
            <div class="theme-desc">${pattern.description}</div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <div class="section-title">Suggested Focus Areas</div>
        <div class="recommendations">
          <ul>
            ${report.content.recommendations.map((rec: string) => `<li>${rec}</li>`).join('')}
          </ul>
        </div>
      </div>

      ${report.content.comparison ? `
        <div class="section">
          <div class="section-title">Progress Comparison</div>
          <div class="summary">
            <p style="margin-bottom: 10px;">Compared to previous report:</p>
            ${report.content.comparison.changes.map((change: any) => `
              <div style="margin: 8px 0;">
                <strong>${change.metric}:</strong> <span style="color: ${change.direction === 'improved' ? '#10B981' :
      change.direction === 'declined' ? '#EF4444' : '#6B7280'
    }">${change.direction}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div class="footer">
        <div style="margin-bottom: 10px;">
          <strong>Generated by AARA</strong> · Pre-Therapy and Therapy Companion
        </div>
        <div class="disclaimer">
          <strong>Important Disclaimer:</strong> This report is not medical advice, diagnosis, or treatment.
          It is a structured summary of the patient's self-reported experiences for therapeutic use only.
          For crisis support, contact a crisis hotline or emergency services immediately.
        </div>
      </div>
    </body>
    </html>
  `;
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generates a secure random token for share links.
 */
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}
