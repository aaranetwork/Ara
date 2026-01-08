/**
 * Firestore Seeding Script for AARA Articles
 * 
 * This script calls the admin API endpoint to seed articles,
 * which uses Firebase Admin SDK with proper permissions.
 * 
 * Usage: 
 *   1. Start your dev server: npm run dev
 *   2. In another terminal: npm run seed:articles
 * 
 * Or: npx tsx scripts/seedArticles.ts
 */

import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

/**
 * Seed articles by calling the admin API endpoint
 */
async function seedArticles(): Promise<void> {
  console.log('🌱 Starting article seeding process...')
  console.log('📡 Calling admin API endpoint...\n')

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  try {
    const response = await fetch(`${baseUrl}/api/admin/seed-articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP ${response.status}` }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    const result = await response.json()
    
    console.log('\n' + '='.repeat(50))
    console.log('📊 Seeding Summary:')
    console.log(`   ✅ Created: ${result.results.created}`)
    console.log(`   ⏭️  Skipped: ${result.results.skipped}`)
    console.log(`   ❌ Errors: ${result.results.errors}`)
    console.log(`   📦 Total: ${result.results.created + result.results.skipped + result.results.errors}`)
    console.log('='.repeat(50))

    if (result.results.errors === 0) {
      console.log('\n✨ Article seeding completed successfully!')
      console.log('🔄 Refresh your Home Page to see the "Explore for a Better Mind" section.')
    } else {
      console.log('\n⚠️  Seeding completed with some errors. Please review the output above.')
    }
  } catch (error: any) {
    console.error('\n❌ Error seeding articles:', error.message)
    console.error('\n💡 Make sure:')
    console.error('   1. Your Next.js dev server is running (npm run dev)')
    console.error('   2. The API route /api/admin/seed-articles is accessible')
    console.error('   3. Firebase Admin SDK is properly configured')
    console.error(`   4. The server is accessible at ${baseUrl}`)
    process.exit(1)
  }
}

// Run the seeding script
seedArticles()
  .then(() => {
    console.log('\n👋 Script finished.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Fatal error during seeding:', error)
    process.exit(1)
  })
