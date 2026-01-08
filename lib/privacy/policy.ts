export type PolicySection = {
  id: string
  title: string
  body: string
  points?: string[]
}

export interface PolicyDoc {
  version: string
  lastUpdated: string // ISO date
  sections: PolicySection[]
}

export const policy: PolicyDoc = {
  version: 'v1.0',
  lastUpdated: '2024-01-15',
  sections: [
    {
      id: 'introduction',
      title: 'Introduction & Scope',
      body: 'This Privacy Policy explains how Aara ("we," "our," or "us") collects, uses, discloses, and protects your personal information when you use our AI-powered therapy and mental wellness platform. By using Aara, you agree to the practices described in this policy.',
      points: [
        'This policy applies to all services offered by Aara, including AI chat therapy, mental wellness games, journaling, and therapist booking.',
        'We are committed to protecting your privacy and giving you control over your personal data.',
        'This policy is designed to comply with GDPR, CCPA, and other applicable privacy regulations.'
      ]
    },
    {
      id: 'data-collection',
      title: 'Data We Collect',
      body: 'We collect different types of information to provide and improve our services. The categories of data we collect include:',
      points: [
        'Account Data: Email address, display name, account preferences, and authentication tokens.',
        'Usage Data: Events and interactions (e.g., games played, features accessed), device type, browser information, IP address (anonymized), session duration, and error logs.',
        'Content Data: Chat messages with Aara, journal entries, mood logs, and game results. This data is user-controlled and stored locally unless you enable Cloud Sync.',
        'Audio Data: Voice recordings from voice journal entries and chat sessions. Audio is processed only when you explicitly enable voice features and provide consent. Recordings can be stored locally or transcribed via OpenAI Whisper API if Cloud Sync is enabled.'
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Data',
      body: 'We use your data for the following purposes:',
      points: [
        'Provide Services: To deliver AI chat therapy, games, journaling tools, therapist booking, and personalized insights based on your activity.',
        'Improve Aara: To analyze aggregated, anonymized usage patterns and enhance our AI models, user experience, and service quality. Your individual content is never used for training without explicit consent.',
        'Payments & Booking: To process payments through Stripe, manage therapist appointments, and send booking confirmations via email.',
        'Communication: To send important service updates, security alerts, and respond to your support requests.'
      ]
    },
    {
      id: 'legal-bases',
      title: 'Legal Bases (GDPR)',
      body: 'Under GDPR, we process your personal data based on the following legal grounds:',
      points: [
        'Consent: When you voluntarily provide data (e.g., journal entries, chat messages) or opt into features like Cloud Sync or marketing emails.',
        'Contract: To fulfill our terms of service and provide the requested therapy and wellness services.',
        'Legitimate Interest: To improve our services, ensure security, prevent fraud, and maintain platform integrity (always balanced against your privacy rights).',
        'Legal Obligation: To comply with applicable laws, regulations, or court orders.'
      ]
    },
    {
      id: 'storage-retention',
      title: 'Data Storage & Retention',
      body: 'Your data is stored securely using industry-standard encryption. We retain your data for different periods depending on the type:',
      points: [
        'Cloud Storage: If Cloud Sync is enabled, your data is stored in Firebase (Google Cloud) with encryption in transit and at rest.',
        'Local-Only Mode: When Local-Only Mode is enabled, your chats, mood logs, and voice notes remain on your device. Nothing is uploaded unless you explicitly enable Cloud Sync.',
        'Retention Periods: Account data is retained while your account is active. You can delete your account and all associated data at any time through your profile settings or by contacting us.',
        'Deletion: Upon account deletion, we permanently remove your data within 30 days, except where we are required to retain it for legal or regulatory purposes.'
      ]
    },
    {
      id: 'sharing-disclosure',
      title: 'Sharing & Disclosure',
      body: 'We do not sell your personal data. We may share your information only in the following circumstances:',
      points: [
        'Service Providers: We share data with trusted processors who help us operate our services, including Firebase (data storage), OpenAI/Gemini/Claude (AI processing, only if Cloud Sync is enabled), ElevenLabs (text-to-speech), Stripe (payments), and email providers (transactional emails).',
        'Therapists: Session summaries are shared with your therapist only if you explicitly enable the "Share Summary" feature in your settings.',
        'Legal Requirements: We may disclose data if required by law, court order, or to protect our rights, privacy, safety, or property.',
        'Business Transfers: In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the transaction, subject to this Privacy Policy.'
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      body: 'You have the following rights regarding your personal data:',
      points: [
        'Access: Request a copy of all personal data we hold about you.',
        'Rectification: Correct inaccurate or incomplete data.',
        'Deletion: Request deletion of your data ("right to be forgotten").',
        'Portability: Receive your data in a structured, machine-readable format.',
        'Restriction: Limit how we process your data in certain circumstances.',
        'Objection: Object to processing based on legitimate interests.',
        'CCPA Rights: California residents have the right to know what personal information we collect, delete their data, and opt-out of "sale" (we do not sell personal data).',
        'To exercise these rights, contact us at privacy@aara.ai or use the in-app data management tools.'
      ]
    },
    {
      id: 'consent-controls',
      title: 'Consent & Controls',
      body: 'You have granular control over your data and privacy settings:',
      points: [
        'Cloud Sync: Toggle on/off to control whether your data is stored in the cloud or kept locally on your device.',
        'Share Summaries: Enable or disable sharing session summaries with your therapist.',
        'Marketing Emails: Opt-in or opt-out of promotional communications.',
        'In-App Controls: Export your data, view data usage, and delete specific entries directly from your profile settings.',
        'Voice Features: Explicit consent is required before any voice recording or transcription occurs.'
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Transfers',
      body: 'Your data may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place:',
      points: [
        'Standard Contractual Clauses (SCCs) are used for transfers to countries without adequacy decisions.',
        'We use regional servers where possible to minimize data transfer distances.',
        'All data transfers comply with GDPR requirements and your local privacy laws.'
      ]
    },
    {
      id: 'security',
      title: 'Security',
      body: 'We implement robust security measures to protect your data:',
      points: [
        'Encryption: All data in transit uses TLS 1.3, and data at rest is encrypted using AES-256.',
        'Access Controls: Role-based access control ensures only authorized personnel can access user data.',
        'Rate Limiting: We implement rate limits and abuse detection to prevent unauthorized access.',
        'Regular Audits: We conduct security assessments and updates to address vulnerabilities.',
        'While we strive for the highest security standards, no system is 100% secure. Please use strong passwords and report any security concerns immediately.'
      ]
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      body: 'Aara is not intended for children under the age of 13 (or the applicable age of consent in your jurisdiction).',
      points: [
        'We do not knowingly collect personal information from children under 13.',
        'If you are a parent or guardian and believe your child has provided us with personal data, please contact us immediately.',
        'We will promptly delete any data we discover was collected from a child under 13.'
      ]
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      body: 'We use cookies and similar technologies to enhance your experience:',
      points: [
        'Strictly Necessary Cookies: Required for the platform to function (e.g., authentication tokens).',
        'Analytics Cookies: Help us understand how users interact with our services (anonymized and aggregated).',
        'Preference Cookies: Remember your settings, such as theme preferences and language.',
        'You can manage cookies through your browser settings. Note that disabling certain cookies may affect platform functionality.'
      ]
    },
    {
      id: 'contact-updates',
      title: 'Contact Us & Updates',
      body: 'For privacy questions, data requests, or concerns, contact us:',
      points: [
        'Email: privacy@aara.ai',
        'We respond to privacy inquiries within 30 days.',
        'Policy Updates: We may update this Privacy Policy from time to time. We will notify you of significant changes via email or in-app notification.',
        'Version History: You can view previous versions of this policy upon request. The "Last Updated" date at the top indicates the most recent revision.'
      ]
    }
  ]
}


