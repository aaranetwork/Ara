import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to topics JSON file
const TOPICS_FILE = path.join(process.cwd(), 'data', 'topics.json')

// Category colors mapping
const categoryColors: Record<string, string> = {
    'Anxiety': '#1e3a8a',
    'Wellness': '#0c4a6e',
    'Fitness': '#7c2d12',
    'Sleep': '#4c1d95',
    'Nutrition': '#134e4a',
    'Psychology': '#7f1d1d',
    'You': '#6366f1'
}

// Utility to generate SEO-friendly slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
}

// Utility to encode ID for URL
function encodeId(id: string): string {
    return Buffer.from(id).toString('base64url') // URL-safe base64
}

// Read topics from JSON file
function getTopics() {
    try {
        const data = fs.readFileSync(TOPICS_FILE, 'utf8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading topics file:', error)
        return []
    }
}

// Write topics to JSON file
function saveTopics(topics: any[]) {
    try {
        fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 4), 'utf8')
        return true
    } catch (error) {
        console.error('Error writing topics file:', error)
        return false
    }
}

// Add slug to topic
function addSlugToTopic(topic: any) {
    const categorySlug = topic.category.toLowerCase().replace(/\s+/g, '-')
    return {
        ...topic,
        slug: `${categorySlug}/${generateSlug(topic.title)}-${encodeId(topic.id)}`
    }
}

export async function GET() {
    // Read topics from file and add slugs
    const topics = getTopics().map(addSlugToTopic)

    // Simulating network delay slightly for realism
    await new Promise(resolve => setTimeout(resolve, 100))
    return NextResponse.json(topics)
}

export async function POST(request: Request) {
    try {
        const body = await request.json()

        // Validate required fields
        const { title, description, detailedAnswer, keyTakeaways, whyMatters, image, category, source } = body
        if (!title || !description || !image || !category || !source) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Get existing topics
        const topics = getTopics()

        // Generate new ID (max + 1)
        const maxId = topics.reduce((max: number, t: any) => {
            const id = parseInt(t.id, 10)
            return id > max ? id : max
        }, 0)
        const newId = String(maxId + 1)

        // Create new topic with all content fields
        const newTopic = {
            id: newId,
            title,
            description,
            detailedAnswer: detailedAnswer || '',
            keyTakeaways: keyTakeaways || '',
            whyMatters: whyMatters || '',
            image,
            category,
            source,
            color: categoryColors[category] || '#6366f1',
            time: 'New'
        }

        // Add to beginning of array (newest first)
        topics.unshift(newTopic)

        // Save to file
        if (!saveTopics(topics)) {
            return NextResponse.json(
                { error: 'Failed to save topic' },
                { status: 500 }
            )
        }

        // Return new topic with slug
        const topicWithSlug = addSlugToTopic(newTopic)

        return NextResponse.json({
            success: true,
            topic: topicWithSlug,
            url: `/discover/${topicWithSlug.slug}`
        })

    } catch (error) {
        console.error('Error creating topic:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
