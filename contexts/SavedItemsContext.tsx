'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SavedItemsContextType {
    savedItems: Set<string>
    toggleSave: (id: string) => void
    isSaved: (id: string) => boolean
    clearSaved: () => void
}

const SavedItemsContext = createContext<SavedItemsContextType | undefined>(undefined)

const STORAGE_KEY = 'aara_discover_saved_items'

export function SavedItemsProvider({ children }: { children: ReactNode }) {
    const [savedItems, setSavedItems] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                const parsed = JSON.parse(stored)
                setSavedItems(new Set(parsed))
            }
        } catch (error) {
            console.error('Error loading saved items:', error)
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage when savedItems changes
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedItems]))
            } catch (error) {
                console.error('Error saving items:', error)
            }
        }
    }, [savedItems, isLoaded])

    const toggleSave = (id: string) => {
        setSavedItems(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    const isSaved = (id: string) => savedItems.has(id)

    const clearSaved = () => {
        setSavedItems(new Set())
        localStorage.removeItem(STORAGE_KEY)
    }

    return (
        <SavedItemsContext.Provider value={{ savedItems, toggleSave, isSaved, clearSaved }}>
            {children}
        </SavedItemsContext.Provider>
    )
}

export function useSavedItems() {
    const context = useContext(SavedItemsContext)
    if (context === undefined) {
        throw new Error('useSavedItems must be used within a SavedItemsProvider')
    }
    return context
}
