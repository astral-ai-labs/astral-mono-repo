/* ==========================================================================*/
// useTabRouting.tsx — Global tab routing context with URL parameter management
/* ==========================================================================*/
// Purpose: Provides context-based tab routing with URL state management
// Sections: Imports, Types, Context, Provider, Hooks

'use client'

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

import React, { createContext, useContext, useCallback, useEffect, Suspense } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'

/* ==========================================================================*/
// Types and Interfaces
/* ==========================================================================*/

interface TabRoutingContextType {
  activeTab: string
  setActiveTab: (tab: string) => void
}

interface TabRoutingProviderProps {
  children: React.ReactNode
  defaultTab: string
  paramName?: string
}

/* ==========================================================================*/
// Context
/* ==========================================================================*/

const TabRoutingContext = createContext<TabRoutingContextType | null>(null)

/* ==========================================================================*/
// Internal Provider Component (wrapped in Suspense)
/* ==========================================================================*/

function TabRoutingProviderInner({ 
  children, 
  defaultTab, 
  paramName = 'tab' 
}: TabRoutingProviderProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  // Get active tab from URL or use default
  const activeTab = searchParams.get(paramName) || defaultTab

  // Optimized tab navigation with clean URLs
  const setActiveTab = useCallback((newTab: string) => {
    const params = new URLSearchParams(searchParams)
    
    // Remove param if returning to default tab for cleaner URLs
    if (newTab === defaultTab) {
      params.delete(paramName)
    } else {
      params.set(paramName, newTab)
    }

    // Build new URL with or without parameters
    const newUrl = params.toString() 
      ? `${pathname}?${params.toString()}` 
      : pathname
    
    // Navigate to new URL
    router.push(newUrl)
  }, [searchParams, pathname, router, paramName, defaultTab])

  // Performance optimization - any global tab change side effects
  useEffect(() => {
    // Optional: Analytics, logging, or other side effects
    // console.log(`Tab changed to: ${activeTab}`)
  }, [activeTab])

  const contextValue = React.useMemo(() => ({
    activeTab,
    setActiveTab
  }), [activeTab, setActiveTab])

  return (
    <TabRoutingContext.Provider value={contextValue}>
      {children}
    </TabRoutingContext.Provider>
  )
}

/* ==========================================================================*/
// Provider Component
/* ==========================================================================*/

/**
 * TabRoutingProvider
 * 
 * Provides global tab routing state via URL parameters
 * Automatically handles URL updates and clean routing
 * 
 * @param children - Child components that need tab routing
 * @param defaultTab - Default tab to show when no URL param exists
 * @param paramName - URL parameter name (defaults to 'tab')
 */
export function TabRoutingProvider(props: TabRoutingProviderProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TabRoutingProviderInner {...props} />
    </Suspense>
  )
}

/* ==========================================================================*/
// Consumer Hooks
/* ==========================================================================*/

/**
 * useActiveTab
 * 
 * Returns the currently active tab
 * Must be used within a TabRoutingProvider
 */
export function useActiveTab(): string {
  const context = useContext(TabRoutingContext)
  if (!context) {
    throw new Error('useActiveTab must be used within TabRoutingProvider')
  }
  return context.activeTab
}

/**
 * useTabNavigation
 * 
 * Returns the setActiveTab function for navigation
 * Must be used within a TabRoutingProvider
 */
export function useTabNavigation(): (tab: string) => void {
  const context = useContext(TabRoutingContext)
  if (!context) {
    throw new Error('useTabNavigation must be used within TabRoutingProvider')
  }
  return context.setActiveTab
} 