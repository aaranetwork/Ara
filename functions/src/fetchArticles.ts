import * as functions from 'firebase-functions'

const YOUR_DOMAIN = functions.config().app?.domain || process.env.NEXT_PUBLIC_SITE_URL || 'https://aara.ai'

export const fetchDailyArticles = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('UTC')
  .onRun(async () => {
    try {
      const apiUrl = `${YOUR_DOMAIN}/api/articles/fetch`
      
      const response = await fetch(apiUrl)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API returned ${response.status}: ${errorText}`)
      }
      
      const result = await response.json()
      
      return result
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      }
    }
  })

