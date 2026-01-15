'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ReadHistoryContextType {
    readItems: Set<string>
    markAsRead: (id: string) => void
    clearHistory: () => void
    isRead: (id: string) => boolean
}

const ReadHistoryContext = createContext<ReadHistoryContextType | undefined>(undefined)

const STORAGE_KEY = 'aara_discover_read_history'

export function ReadHistoryProvider({ children }: { children: ReactNode }) {
    const [readItems, setReadItems] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setReadItems(new Set(parsed))
            }
        } catch (error) {
            console.error('Error loading read history:', error)
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage when readItems changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...readItems]))
            } catch (error) {
                console.error('Error saving read history:', error)
            }
        }
    }, [readItems, isLoaded])

    const markAsRead = (id: string) => {
        setReadItems(prev => {
            const newSet = new Set(prev)
            newSet.add(id)
            return newSet
        })
    }

    const clearHistory = () => {
        setReadItems(new Set())
        localStorage.removeItem(STORAGE_KEY)
    }

    const isRead = (id: string) => readItems.has(id)

    return (
        <ReadHistoryContext.Provider value={{ readItems, markAsRead, clearHistory, isRead }}>
            {children}
        </ReadHistoryContext.Provider>
    )
}

export function useReadHistory() {
    const context = useContext(ReadHistoryContext)
    if (context === undefined) {
        throw new Error('useReadHistory must be used within a ReadHistoryProvider')
    }
    return context
}
