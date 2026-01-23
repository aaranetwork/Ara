/**
 * Admin API Route for Seeding Articles
 * 
 * This endpoint uses Firebase Admin SDK to seed articles with proper permissions.
 * Accessible only in development or with proper authentication.
 * 
 * Usage: POST /api/admin/seed-articles
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/admin'
import { Timestamp } from 'firebase-admin/firestore'

interface ArticleData {
  title: string
  category: 'Calm' | 'Focus' | 'Positivity' | 'Sleep' | 'Growth'
  imageUrl: string
  readTime: string
  content: string
}

const articles: ArticleData[] = [
  {
    title: '5 Habits to Calm Your Mind',
    category: 'Calm',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    content: `<p><strong>Start your day with deep breathing.</strong> Before you reach for your phone, take 10 slow breaths — in through your nose, out through your mouth.</p>

<p>When stress hits, <strong>pause and name what you feel</strong>. "I notice I'm feeling anxious about..." Naming emotions reduces their intensity.</p>

<p><strong>Take micro-breaks</strong> — every hour, stand up, stretch, and look out a window for 30 seconds. Movement resets your nervous system.</p>

<p><strong>End your day with a calming ritual</strong> — maybe herbal tea, soft music, or gentle stretches. Consistency signals safety to your brain.</p>

<p>Remember: <em>calm isn't the absence of stress; it's how you respond to it.</em></p>`,
  },
  {
    title: 'Train Your Focus in 10 Minutes',
    category: 'Focus',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    content: `<p>Try the <strong>4-7-8 breathing technique</strong> to sharpen attention: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.</p>

<p><strong>Single-tasking beats multi-tasking.</strong> Pick one task, set a timer for 25 minutes (Pomodoro), and give it your full attention. When the timer rings, take a 5-minute break.</p>

<p><strong>Remove distractions</strong> — put your phone in another room, close unnecessary tabs, and silence notifications. Your brain can only focus on so much at once.</p>

<p><strong>Practice "attention anchoring"</strong> — choose a single point (a candle flame, a mark on the wall) and stare at it for 2 minutes without letting your mind wander.</p>

<p>Focus is a muscle. Train it daily, and you'll notice improved concentration within weeks.</p>`,
  },
  {
    title: 'How to Reframe Negative Thoughts',
    category: 'Positivity',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1502691876148-a84978e95af8?w=800&h=600&fit=crop',
    content: `<p><strong>The words you use shape your reality.</strong> When you catch yourself saying "I always mess up," pause and reframe: "I made a mistake, and I can learn from it."</p>

<p><strong>Challenge negative assumptions.</strong> Ask: "Is this thought helpful? Is it true?" Often, our worst-case scenarios never happen.</p>

<p><strong>Practice gratitude journaling.</strong> Each night, write down three specific things that went well today — even tiny wins count. This rewires your brain to notice the positive.</p>

<p><strong>Use "yet" to shift perspective.</strong> Instead of "I can't do this," say "I can't do this <em>yet</em>." It opens the door to growth.</p>

<p>Remember: You're not replacing reality with false positivity. You're choosing to see a fuller, more balanced picture.</p>`,
  },
  {
    title: 'Night Rituals for Better Sleep',
    category: 'Sleep',
    readTime: '2 min',
    imageUrl: 'https://images.unsplash.com/photo-1495312040809-3d66e49c8f9d?w=800&h=600&fit=crop',
    content: `<p><strong>No screens 30 minutes before bed.</strong> Blue light tricks your brain into thinking it's daytime. Instead, read a book (paper or e-ink), do gentle stretches, or listen to calming music.</p>

<p><strong>Keep your bedroom cool and dark.</strong> Aim for 65-68°F (18-20°C). Use blackout curtains or a sleep mask if needed.</p>

<p><strong>Create a "wind-down" routine.</strong> Dim the lights, sip herbal tea (chamomile or lavender), and practice deep breathing. Consistency trains your body that it's time to rest.</p>

<p><strong>Avoid caffeine after 2 PM</strong> and heavy meals 3 hours before bedtime. Your digestive system needs time to settle.</p>

<p>Sleep is non-negotiable self-care. Treat it with the same respect you give exercise and nutrition.</p>`,
  },
  {
    title: 'How to Build Emotional Resilience',
    category: 'Growth',
    readTime: '5 min',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    content: `<p><strong>Challenges are the raw materials of growth.</strong> Every difficult moment teaches you something about yourself — your strengths, your limits, and your capacity to adapt.</p>

<p><strong>Practice self-compassion.</strong> When you struggle, talk to yourself like you would a friend. "This is hard right now, and that's okay. You're doing your best."</p>

<p><strong>Build a support network.</strong> Surround yourself with people who see your potential, celebrate your wins, and hold space for your struggles.</p>

<p><strong>Embrace "productive discomfort."</strong> Not all discomfort is bad. Sometimes growth requires stepping outside your comfort zone. The key is distinguishing between growth-stretching and harmful stress.</p>

<p><strong>Reflect on past challenges.</strong> Look back at times you thought you couldn't handle something — and you did. That's proof of your resilience.</p>

<p>Resilience isn't about never falling. It's about getting back up — each time, stronger and wiser.</p>`,
  },
  {
    title: 'Let Go of Things You Can\'t Control',
    category: 'Calm',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop',
    content: `<p><strong>Peace comes from acceptance, not control.</strong> You can't control what others say, do, or think. You can only control your response.</p>

<p><strong>Use the "Circle of Control" exercise.</strong> Draw two circles: inner (what you control — your actions, words, effort) and outer (what you don't — others' opinions, the weather, traffic). Focus your energy on the inner circle.</p>

<p><strong>When worry hits, ask:</strong> "Is there anything I can do about this right now?" If yes, do it. If no, acknowledge it and let it go.</p>

<p><strong>Practice "surrendering" small things.</strong> Start with something tiny — like letting someone else choose where to eat. Notice how freeing it feels.</p>

<p>Remember: Letting go isn't giving up. It's choosing to spend your energy on what truly matters — your growth, your peace, your joy.</p>`,
  },
  {
    title: 'Simple Ways to Beat Procrastination',
    category: 'Focus',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    content: `<p><strong>Start with micro-tasks and momentum builds.</strong> Instead of "clean the entire house," commit to "wash 5 dishes" or "organize one drawer." Action breeds more action.</p>

<p><strong>Use the "2-minute rule."</strong> If something takes less than 2 minutes, do it immediately. Small wins create momentum for bigger tasks.</p>

<p><strong>Break big projects into tiny steps.</strong> Write each step on a sticky note. Focus on one at a time. You'll be surprised how fast you progress.</p>

<p><strong>Remove the friction.</strong> Set up your environment for success. Want to exercise? Lay out your clothes the night before. Want to write? Open your document first thing in the morning.</p>

<p><strong>Forgive yourself for past procrastination.</strong> Guilt and shame keep you stuck. Every moment is a fresh start.</p>

<p>Procrastination isn't laziness — it's often fear of imperfection. Start imperfectly. You can refine later.</p>`,
  },
  {
    title: 'Practice Gratitude Daily',
    category: 'Positivity',
    readTime: '2 min',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    content: `<p><strong>Each night, name three things that made you smile.</strong> It could be the taste of morning coffee, a kind word from a colleague, or the warmth of sunlight on your face.</p>

<p><strong>Be specific.</strong> Instead of "I'm grateful for my family," try "I'm grateful my partner made me laugh during dinner" or "I'm grateful my child shared their drawing with me."</p>

<p><strong>Write it down.</strong> Keep a gratitude journal. The act of writing reinforces positive neural pathways in your brain.</p>

<p><strong>Share it with others.</strong> Tell someone what you're grateful for. "Thank you for listening" or "I appreciate how you helped me today." Gratitude is contagious.</p>

<p><strong>Notice the small things.</strong> You don't need big wins to practice gratitude. The sound of birds, a comfortable chair, clean water — all deserve acknowledgment.</p>

<p>Gratitude isn't denying difficulty. It's choosing to also see the good, no matter how small.</p>`,
  },
  {
    title: 'Why Consistent Bedtime Matters',
    category: 'Sleep',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1495312040809-3d66e49c8f9d?w=800&h=600&fit=crop',
    content: `<p><strong>Your brain loves rhythm — sleep and wake at fixed hours.</strong> When you go to bed and wake up at the same time (even on weekends), your body's internal clock stabilizes.</p>

<p><strong>Consistency improves sleep quality.</strong> Your brain learns to anticipate sleep, making it easier to fall asleep and stay asleep. You'll wake up more refreshed.</p>

<p><strong>Choose a realistic bedtime.</strong> Pick a time you can stick to 90% of the time. Better to have a consistent 11 PM than an inconsistent 9 PM.</p>

<p><strong>Allow for a 15-minute buffer.</strong> If your goal is 10 PM, start your wind-down routine at 9:45 PM. This gives your body time to transition.</p>

<p><strong>Track your sleep.</strong> Use a simple app or journal to see how consistent bedtime affects your energy, mood, and focus the next day.</p>

<p>One week of consistency can transform your sleep. Your future self will thank you.</p>`,
  },
  {
    title: 'How to Stay Kind During Stress',
    category: 'Growth',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    content: `<p><strong>Kindness disarms tension — begin with yourself.</strong> When you're stressed, you might be quick to snap at others. First, pause and offer yourself compassion: "I'm having a hard moment. That's okay."</p>

<p><strong>Take a "kindness break."</strong> When stress spikes, do one small act of kindness — hold a door, send a supportive text, or give someone a genuine compliment. Kindness rewires your stress response.</p>

<p><strong>Remember that everyone is fighting a battle.</strong> That person who cut you off in traffic? They might be rushing to a sick relative. Assume good intentions when possible.</p>

<p><strong>Set boundaries with kindness.</strong> You can say "no" firmly and respectfully. "I appreciate you thinking of me, but I can't take this on right now."</p>

<p><strong>Practice "compassionate listening."</strong> When someone shares their struggle, resist the urge to fix it. Just listen and validate: "That sounds really hard. I'm here for you."</p>

<p>Kindness under pressure is a superpower. It transforms stress into connection and conflict into understanding.</p>`,
  },
  {
    title: 'The Power of Deep Breathing',
    category: 'Calm',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    content: `<p><strong>Your breath is always with you — use it.</strong> When anxiety or stress hits, your breath becomes shallow and rapid. Taking control of your breathing immediately signals safety to your nervous system.</p>

<p><strong>Try "box breathing":</strong> Inhale for 4 counts, hold for 4, exhale for 4, hold for 4. Repeat 4-5 times. This technique is used by Navy SEALs to stay calm under pressure.</p>

<p><strong>Make it a daily habit.</strong> Practice breathing exercises when you're calm, so they become automatic tools during stressful moments.</p>

<p><strong>Notice your breath throughout the day.</strong> Set reminders to pause and take 3 deep breaths. This builds awareness and prevents stress from accumulating.</p>

<p>Your breath is the bridge between your mind and body. Master it, and you master your response to stress.</p>`,
  },
  {
    title: 'Building Healthy Boundaries',
    category: 'Growth',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop',
    content: `<p><strong>Boundaries aren't walls — they're bridges to healthier relationships.</strong> Clear boundaries protect your energy and help others know how to treat you.</p>

<p><strong>Start small.</strong> Practice saying "no" to small requests that drain you. "I can't make it to that event, but I'd love to catch up another time."</p>

<p><strong>Communicate clearly.</strong> Instead of vague responses, be specific: "I'm not available for calls after 8 PM" or "I need 24 hours to respond to emails."</p>

<p><strong>Protect your time and energy.</strong> Your mental health is a priority. It's okay to prioritize rest, hobbies, and self-care over constant availability.</p>

<p><strong>Expect pushback — and hold firm.</strong> People who benefit from your lack of boundaries may resist when you set them. That's normal. Your wellbeing comes first.</p>

<p>Healthy boundaries aren't selfish. They're essential for sustainable relationships and personal growth.</p>`,
  },
  {
    title: 'Morning Routines That Energize',
    category: 'Focus',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    content: `<p><strong>How you start your day shapes the rest of it.</strong> Instead of reaching for your phone first, create a morning routine that energizes and centers you.</p>

<p><strong>Wake up 15 minutes earlier.</strong> Use this time for yourself — meditation, stretching, journaling, or a quiet cup of tea. This small investment pays dividends all day.</p>

<p><strong>Move your body.</strong> Even 5 minutes of gentle movement — stretching, walking, or yoga — boosts energy and mood.</p>

<p><strong>Eat a nourishing breakfast.</strong> Fuel your body with protein and whole foods. Avoid sugar crashes that lead to afternoon slumps.</p>

<p><strong>Set one intention for the day.</strong> "Today, I'll focus on being patient" or "Today, I'll practice gratitude." One clear intention guides your choices.</p>

<p>A mindful morning routine doesn't have to be perfect. Even 10 minutes of intentional time can transform your day.</p>`,
  },
  {
    title: 'Cultivating Self-Love',
    category: 'Positivity',
    readTime: '4 min',
    imageUrl: 'https://images.unsplash.com/photo-1502691876148-a84978e95af8?w=800&h=600&fit=crop',
    content: `<p><strong>Self-love isn't selfish — it's essential.</strong> You can't pour from an empty cup. Taking care of yourself enables you to show up fully for others.</p>

<p><strong>Talk to yourself like a friend.</strong> Notice your inner critic. When it says "You always mess up," respond with "I'm learning and growing, just like everyone else."</p>

<p><strong>Celebrate small wins.</strong> Finished a task? Acknowledged a difficult emotion? Took a break when needed? These are wins worth celebrating.</p>

<p><strong>Prioritize self-care without guilt.</strong> Rest, hobbies, and activities that bring you joy aren't optional — they're necessary for your wellbeing.</p>

<p><strong>Forgive yourself for mistakes.</strong> Perfection isn't the goal. Growth is. Every mistake is a learning opportunity.</p>

<p>Self-love is a practice, not a destination. Be patient and compassionate with yourself as you learn to treat yourself with the kindness you show others.</p>`,
  },
  {
    title: 'Creating a Peaceful Evening',
    category: 'Sleep',
    readTime: '3 min',
    imageUrl: 'https://images.unsplash.com/photo-1495312040809-3d66e49c8f9d?w=800&h=600&fit=crop',
    content: `<p><strong>Your evening routine sets the stage for restful sleep.</strong> Transition from the busyness of the day to a state of calm and relaxation.</p>

<p><strong>Dim the lights 1-2 hours before bed.</strong> This signals to your brain that it's time to wind down. Use lamps instead of overhead lights.</p>

<p><strong>Do a "brain dump."</strong> Write down any worries, tasks, or thoughts on paper. Getting them out of your head helps you let go.</p>

<p><strong>Practice gentle movement.</strong> Light stretching, yoga, or a slow walk helps release physical tension from the day.</p>

<p><strong>Create a "shutdown ritual."</strong> Close your laptop, tidy your space, and prepare for tomorrow. This signals closure and allows your mind to rest.</p>

<p>An intentional evening routine helps you end the day with peace and wake up refreshed.</p>`,
  },
]

export async function POST(request: NextRequest) {
  // Allow in development, or with proper authentication in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  const hasAuth = request.headers.get('authorization') === `Bearer ${process.env.ADMIN_API_KEY}`

  if (!isDevelopment && !hasAuth) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  if (!adminDb) {
    console.error('Failed to initialize Admin SDK')
    return NextResponse.json(
      {
        error: 'Firebase Admin SDK not initialized. For production, ensure FIREBASE env vars are set.',
      },
      { status: 500 }
    )
  }

  try {
    const results = {
      created: 0,
      skipped: 0,
      errors: 0,
    }

    const articlesRef = adminDb.collection('articles')

    // Process articles in batches
    for (const article of articles) {
      try {
        // Check if article exists
        const existingQuery = await articlesRef.where('title', '==', article.title).limit(1).get()

        if (!existingQuery.empty) {
          results.skipped++
          continue
        }

        // Add article with server timestamp
        await articlesRef.add({
          ...article,
          createdAt: Timestamp.now(),
        })

        results.created++
      } catch (error: any) {
        console.error(`Error creating "${article.title}":`, error)
        results.errors++
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Articles seeded successfully',
      results,
    })
  } catch (error: any) {
    console.error('Seeding error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed articles' },
      { status: 500 }
    )
  }
}

