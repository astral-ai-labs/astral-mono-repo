/* ==========================================================================*/
// use-header-collapse.tsx — Custom hook for header collapse state management
/* ==========================================================================*/
// Purpose: Provides global state and controls for collapsible header functionality
// Sections: Imports, Hook, Exports

"use client";

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import { createContext, useContext, useState, ReactNode } from "react";

/* ==========================================================================*/
// Context and Types
/* ==========================================================================*/

interface HeaderCollapseContextType {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  collapse: () => void;
  expand: () => void;
}

const HeaderCollapseContext = createContext<HeaderCollapseContextType | undefined>(undefined);

/* ==========================================================================*/
// Provider Component
/* ==========================================================================*/

interface HeaderCollapseProviderProps {
  children: ReactNode;
}

/**
 * HeaderCollapseProvider
 *
 * Provides collapsible header state to the entire app.
 * Should be placed at the root level of the platform layout.
 */
export function HeaderCollapseProvider({ children }: HeaderCollapseProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
  const collapse = () => setIsCollapsed(true);
  const expand = () => setIsCollapsed(false);

  return (
    <HeaderCollapseContext.Provider 
      value={{ 
        isCollapsed, 
        toggleCollapse, 
        collapse, 
        expand 
      }}
    >
      {children}
    </HeaderCollapseContext.Provider>
  );
}

/* ==========================================================================*/
// Hook
/* ==========================================================================*/

/**
 * useHeaderCollapse
 *
 * Custom hook to access and control header collapse state from any component.
 *
 * @returns Object with collapse state and control functions
 *
 * @example
 * const { isCollapsed, toggleCollapse } = useHeaderCollapse();
 */
export function useHeaderCollapse() {
  const context = useContext(HeaderCollapseContext);
  
  if (context === undefined) {
    throw new Error('useHeaderCollapse must be used within a HeaderCollapseProvider');
  }
  
  return context;
} 