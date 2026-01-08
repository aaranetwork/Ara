'use client'

import { useCommonShortcuts } from '@/hooks/useKeyboardShortcuts'
import { ReactNode } from 'react'

export function KeyboardShortcutsProvider({ children }: { children: ReactNode }) {
  // Enable common keyboard shortcuts globally
  useCommonShortcuts()
  
  return <>{children}</>
}


