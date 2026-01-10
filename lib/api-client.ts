/**
 * AARA API Client
 * Handles communication with the AARA backend API
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  message: string
  sessionId?: string
  error?: string
}

export interface ChatRequest {
  sessionId: string
  messages: ChatMessage[]
}

export interface SessionResponse {
  sessionId: string
  userId: string
  createdAt: string
  error?: string
}

// API Base URL - FORCE HARDCODED for debugging
// const API_BASE_URL = 'http://localhost:3005'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

/**
 * Get authorization headers
 */
const getAuthHeaders = (token?: string): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const apiClient = {
  /**
   * Create a new chat session
   */
  async createSession(userId: string, token?: string): Promise<SessionResponse> {
    try {
      // Use internal API route for session creation which handles mocking
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to create session')
      }

      return await response.json()
    } catch (error: any) {
      console.error('Create Session Error:', error)
      return {
        sessionId: '',
        userId: '',
        createdAt: '',
        error: error.message || 'Failed to create session',
      }
    }
  },

  /**
   * Send a chat message (new API format with /v1/chat/completions)
   */
  async sendMessage(
    sessionId: string,
    message: string,
    token?: string
  ): Promise<ChatResponse> {
    try {
      // Use internal proxy route to handle fallback logic
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({
          sessionId,
          message, // Proxy expects 'message', not 'messages' array directly
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to send message')
      }

      return await response.json()
    } catch (error: any) {
      console.error('API Error:', error)
      return {
        message: '',
        error: error.message || 'An unexpected error occurred',
      }
    }
  },

  /**
   * Send a chat message via the Next.js proxy (for internal API route usage)
   * This is useful when you want to hide the API token on the server side
   */
  async sendMessageViaProxy(
    message: string,
    sessionId?: string | null,
    token?: string
  ): Promise<ChatResponse> {
    return this.sendMessage(sessionId || '', message, token)
  },

  /**
   * Get User Stats (Streak, Minutes, Clarity, Activity)
   */
  async getUserStats(token?: string) {
    try {
      // Use internal API route
      const response = await fetch('/api/user/stats', {
        method: 'POST', // Using POST to be consistent with other internal routes, or GET if pref
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        console.error('getUserStats failed:', response.status, await response.text())
        throw new Error('Failed to sync user stats')
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get user stats:', error)
      throw error // Re-throw to be caught by caller
    }
  },
}
