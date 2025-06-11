/* ==========================================================================*/
// audience-provider.tsx — Audience context provider
/* ==========================================================================*/
// Purpose: Provides audience state and constants through context
// Sections: Imports, Context, Provider, Hook, Exports

"use client";

// React Core ---
import { createContext, useContext, useState, ReactNode } from "react";

// Local Constants ---
import { builderConstants, enterpriseConstants } from "@/constants";

/* ==========================================================================*/
// Context Definition
/* ==========================================================================*/

interface AudienceContextType {
  currentAudience: "builders" | "enterprise";
  setCurrentAudience: (audience: "builders" | "enterprise") => void;
  constants: typeof builderConstants;
}

const AudienceContext = createContext<AudienceContextType | undefined>(undefined);

/* ==========================================================================*/
// Provider Component
/* ==========================================================================*/

interface AudienceProviderProps {
  children: ReactNode;
}

/**
 * AudienceProvider
 *
 * Provides audience state and appropriate constants to all children.
 * Constants automatically switch based on the current audience.
 */
function AudienceProvider({ children }: AudienceProviderProps) {
  const [currentAudience, setCurrentAudience] = useState<"builders" | "enterprise">("builders");

  // Get constants based on current audience
  const constants = currentAudience === "builders" ? builderConstants : enterpriseConstants;

  const value = {
    currentAudience,
    setCurrentAudience,
    constants,
  };

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

/* ==========================================================================*/
// Hook
/* ==========================================================================*/

/**
 * useAudience
 *
 * Hook to access audience state and constants.
 * Must be used within an AudienceProvider.
 */
function useAudience() {
  const context = useContext(AudienceContext);
  if (context === undefined) {
    throw new Error("useAudience must be used within an AudienceProvider");
  }
  return context;
}

/* ==========================================================================*/
// Public Exports
/* ==========================================================================*/

export { AudienceProvider, useAudience };
