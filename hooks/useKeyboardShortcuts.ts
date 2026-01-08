'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  action: () => void
  description?: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      shortcuts.forEach((shortcut) => {
        const matchesKey = e.key.toLowerCase() === shortcut.key.toLowerCase()
        const matchesCtrl = shortcut.ctrlKey ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey
        const matchesShift = shortcut.shiftKey ? e.shiftKey : !e.shiftKey

        if (matchesKey && matchesCtrl && matchesShift) {
          e.preventDefault()
          shortcut.action()
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}

// Common shortcuts hook
export function useCommonShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useKeyboardShortcuts([
    {
      key: 'g',
      ctrlKey: true,
      action: () => router.push('/games'),
      description: 'Go to Games',
    },
    {
      key: 'c',
      ctrlKey: true,
      action: () => router.push('/chat'),
      description: 'Go to Chat',
    },
    {
      key: 'j',
      ctrlKey: true,
      action: () => router.push('/journal'),
      description: 'Go to Journal',
    },
    {
      key: 'p',
      ctrlKey: true,
      action: () => router.push('/profile'),
      description: 'Go to Profile',
    },
    {
      key: '/',
      action: () => {
        // Focus search if available, otherwise go to chat
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        } else {
          router.push('/chat')
        }
      },
      description: 'Focus search or go to Chat',
    },
  ])
}


