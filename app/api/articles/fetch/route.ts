import { NextRequest, NextResponse } from 'next/server'
import { db, isAdminInitialized } from '@/lib/firebaseAdmin'

const API_KEY = process.env.NEWS_API_KEY || process.env.GOOGLE_NEWS_API_KEY
const CATEGORIES = ['mental health', 'mindfulness', 'therapy', 'calm', 'wellness', 'focus']
const COUNTRIES = ['us', 'in', 'gb']

export async function GET(_request: NextRequest) {
  try {
    let count = 0
    let skipped = 0

    if (!API_KEY) {
      return NextResponse.json(
        {
          error: 'Missing NEWS_API_KEY or GOOGLE_NEWS_API_KEY in environment',
          hint: 'Get your API key from https://newsapi.org'
        },
        { status: 500 }
      )
    }

    if (!db || !isAdminInitialized()) {
      return NextResponse.json(
        {
          error: 'Firestore Admin SDK not initialized',
          hint: 'Set NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env.local. This should match your Firebase project ID.'
        },
        { status: 500 }
      )
    }

    for (const cat of CATEGORIES) {
      try {
        let url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(cat)}&language=en&sortBy=publishedAt&pageSize=10&apiKey=${API_KEY}`
        let res = await fetch(url)

        if (!res.ok) {
          continue
        }

        let data = await res.json()

        if (data.status !== 'ok' || !data.articles?.length) {
          for (const country of COUNTRIES) {
            const backup = `https://newsapi.org/v2/top-headlines?category=health&country=${country}&pageSize=5&apiKey=${API_KEY}`
            const res2 = await fetch(backup)

            if (res2.ok) {
              const data2 = await res2.json()
              if (data2.status === 'ok' && data2.articles?.length) {
                data.articles = data2.articles
                break
              }
            }
          }
        }

        if (!data.articles?.length) {
          continue
        }

        for (const art of data.articles) {
          if (!art.title || !art.url) {
            skipped++
            continue
          }

          const docId = art.url.replace(/[^\w]/g, '_').substring(0, 255)

          try {
            const existingDoc = await (db as any).collection('articles').doc(docId).get()
            if (existingDoc.exists) {
              skipped++
              continue
            }
          } catch {
          }

          const docData = {
            title: art.title,
            description: art.description || '',
            url: art.url,
            image: art.urlToImage || '',
            category: cat,
            source: art.source?.name || 'Unknown',
            publishedAt: art.publishedAt || new Date().toISOString(),
            createdAt: new Date().toISOString(),
            summary: art.description || '',
          }

          try {
            await (db as any).collection('articles').doc(docId).set(docData, { merge: true })
            count++
          } catch (error: any) {
            skipped++
          }
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error: any) {
      }
    }

    if (count === 0 && skipped > 0) {
      try {
        const totalSnapshot = await (db as any).collection('articles').count().get()
        const totalCount = totalSnapshot.data().count || 0

        return NextResponse.json({
          message: 'All articles already exist (Firestore cached)',
          count: 0,
          skipped,
          timestamp: new Date().toISOString(),
          firestoreCount: totalCount,
        })
      } catch {
      }
    }

    return NextResponse.json({
      message: count > 0 ? 'Articles fetched successfully' : 'All articles already exist (Firestore cached)',
      count,
      skipped,
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message || 'Failed to fetch articles',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { error: 'Firestore Admin SDK not initialized' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { title, summary, source, link, category, image } = body

    if (!title || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: title, category' },
        { status: 400 }
      )
    }

    const docId = link ? link.replace(/[^\w]/g, '_').substring(0, 255) :
      title.toLowerCase().replace(/[^\w]/g, '_').substring(0, 255)

    const newArticle = {
      title,
      description: summary || '',
      summary: summary || '',
      url: link || '',
      image: image || '',
      category,
      source: source || 'Aara',
      publishedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      fetchedFrom: 'manual',
    }

    await (db as any).collection('articles').doc(docId).set(newArticle, { merge: true })

    return NextResponse.json({
      id: docId,
      ...newArticle,
      message: 'Article added successfully',
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to add article' },
      { status: 500 }
    )
  }
}

