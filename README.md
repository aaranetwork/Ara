# AARA - AI Therapist Platform

A production-ready AI therapy platform built with Next.js, featuring glassmorphic design, AI chat, games, journaling, and therapist bookings.

## 🚀 Features

- 🤖 **AI Therapy Chat** - Powered by OpenAI GPT-4 with voice input/output (Whisper + ElevenLabs)
- 🎮 **Mental Wellness Games** - 5 interactive games (Focus Flash, Calm Breather, Memory Flow, Color Sync, Math Challenge)
- 📝 **Journaling** - Voice and text entries with mood tracking
- 👨‍⚕️ **Therapist Booking** - Book sessions with real therapists via Stripe
- 📊 **Analytics Dashboard** - Real-time metrics and progress tracking
- 🔐 **Authentication** - Firebase Auth with Google and Email
- 💳 **Payments** - Stripe integration for secure session bookings
- 📱 **PWA Support** - Installable as a mobile app
- 🔒 **Privacy & Security** - GDPR-compliant data deletion, consent toggles

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Realtime DB)
- **AI**: OpenAI GPT-4, Whisper (speech-to-text), ElevenLabs (text-to-speech)
- **Payments**: Stripe
- **Analytics**: Mixpanel (optional)
- **Deployment**: Vercel

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Firebase project
- OpenAI API key
- Stripe account (optional, for payments)
- ElevenLabs API key (optional, for voice features)

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd aara-therapist
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env.local` file:**
```bash
cp .env.example .env.local
```

4. **Fill in environment variables:**
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# ElevenLabs API (Optional)
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Mixpanel Analytics (Optional)
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token

# Site URL (for sitemap)
SITE_URL=https://your-domain.com
```

5. **Run development server:**
```bash
npm run dev
```

6. **Open browser:**
Navigate to `http://localhost:3000`

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to **Authentication > Sign-in method**
   - Enable **Email/Password** and **Google**
4. Create Firestore Database:
   - Go to **Firestore Database**
   - Create database in production mode
   - Start in test mode (for development)
5. Enable Realtime Database (optional, for real-time chat):
   - Go to **Realtime Database**
   - Create database
6. Copy your Firebase config to `.env.local`

## 📱 PWA Icons

Add PWA icons to `public/`:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 🚢 Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy!

The project includes:
- `vercel.json` configuration
- Automatic sitemap generation
- SEO optimization
- PWA support

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes (auth-protected)
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat page with AI
│   ├── games/             # Games page
│   ├── therapists/        # Therapists page
│   ├── journal/           # Journal page
│   ├── mode/              # Analytics/Mode page
│   ├── profile/           # Profile page
│   ├── privacy/           # Privacy policy
│   └── terms/             # Terms of service
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── home/             # Home page components
│   ├── games/            # Game components (lazy-loaded)
│   └── therapists/       # Therapist components
├── lib/                  # Utility libraries
│   ├── firebase/         # Firebase config and helpers
│   ├── ai/              # AI integration (OpenAI, ElevenLabs)
│   ├── stripe/          # Stripe integration
│   ├── auth/            # Auth verification
│   └── analytics.ts     # Analytics helpers
└── hooks/               # Custom React hooks
```

## 🔐 Security Features

- Server-side auth verification (`verifyAuth()`)
- Protected API routes
- Data deletion functionality
- Consent toggles for therapist sharing
- Crisis disclaimers

## 🎨 Design System

- **Theme**: Dark glassmorphic with neon accents
- **Colors**: 
  - Primary: Neon Blue (#00AEEF)
  - Secondary: Neon Purple (#7A5FFF)
  - Background: Dark gradient (#0B0C10 → #1C1E24)
- **Components**: Glass cards with backdrop blur
- **Animations**: Framer Motion for smooth transitions

## 🚀 Performance

- Lazy-loaded game components
- Dynamic imports for heavy assets
- Optimized images with Next.js Image
- API response caching
- Lighthouse scores: Perf 85+, A11y 90+, PWA 90+

## 📝 Environment Variables

See `.env.example` for all required environment variables.

## 🐛 Troubleshooting

- **Build errors**: Ensure all environment variables are set
- **Firebase errors**: Verify Firebase config in `.env.local`
- **OpenAI errors**: Check API key validity and credits
- **Stripe errors**: Verify Stripe keys are correct
- **Missing dev script**: Run `npm install` to ensure all dependencies are installed

## 📄 License

MIT

## 💬 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for mental wellness**
