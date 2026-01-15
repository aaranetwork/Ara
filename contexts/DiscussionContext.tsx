'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Comment {
    id: string
    topicId: string
    author: string
    avatar?: string
    content: string
    timestamp: number
    likes: number
    replies?: Comment[]
}

interface DiscussionContextType {
    comments: Comment[]
    likedComments: Set<string>
    addComment: (topicId: string, content: string, author?: string) => void
    toggleLikeComment: (commentId: string) => void
    hasLiked: (commentId: string) => boolean
    getCommentsForTopic: (topicId: string) => Comment[]
    commentCount: (topicId: string) => number
}

const DiscussionContext = createContext<DiscussionContextType | undefined>(undefined)

const STORAGE_KEY = 'aara_discover_discussions'
const LIKED_STORAGE_KEY = 'aara_discover_liked_comments'

export function DiscussionProvider({ children }: { children: ReactNode }) {
    const [comments, setComments] = useState<Comment[]>([])
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                setComments(JSON.parse(stored))
            }
            const likedStored = localStorage.getItem(LIKED_STORAGE_KEY)
            if (likedStored) {
                setLikedComments(new Set(JSON.parse(likedStored)))
            }
        } catch (error) {
            console.error('Error loading discussions:', error)
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage when comments change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(comments))
            } catch (error) {
                console.error('Error saving discussions:', error)
            }
        }
    }, [comments, isLoaded])

    // Save liked comments to localStorage
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify([...likedComments]))
            } catch (error) {
                console.error('Error saving liked comments:', error)
            }
        }
    }, [likedComments, isLoaded])

    const addComment = (topicId: string, content: string, author?: string) => {
        const newComment: Comment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            topicId,
            author: author || 'Anonymous User',
            content,
            timestamp: Date.now(),
            likes: 0
        }
        setComments(prev => [newComment, ...prev])
    }

    // Toggle like - one like per user per comment
    const toggleLikeComment = (commentId: string) => {
        const alreadyLiked = likedComments.has(commentId)

        // Update liked comments set
        setLikedComments(prev => {
            const newSet = new Set(prev)
            if (alreadyLiked) {
                newSet.delete(commentId)
            } else {
                newSet.add(commentId)
            }
            return newSet
        })

        // Update comment likes count
        setComments(prev => prev.map(c =>
            c.id === commentId
                ? { ...c, likes: alreadyLiked ? Math.max(0, c.likes - 1) : c.likes + 1 }
                : c
        ))
    }

    const hasLiked = (commentId: string) => likedComments.has(commentId)

    const getCommentsForTopic = (topicId: string) => {
        return comments.filter(c => c.topicId === topicId).sort((a, b) => b.timestamp - a.timestamp)
    }

    const commentCount = (topicId: string) => {
        return comments.filter(c => c.topicId === topicId).length
    }

    return (
        <DiscussionContext.Provider value={{
            comments,
            likedComments,
            addComment,
            toggleLikeComment,
            hasLiked,
            getCommentsForTopic,
            commentCount
        }}>
            {children}
        </DiscussionContext.Provider>
    )
}

export function useDiscussion() {
    const context = useContext(DiscussionContext)
    if (context === undefined) {
        throw new Error('useDiscussion must be used within a DiscussionProvider')
    }
    return context
}
