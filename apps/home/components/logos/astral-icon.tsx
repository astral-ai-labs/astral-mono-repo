/* ==========================================================================*/
// astral-icon.tsx — Astral Icon Component
/* ==========================================================================*/
// Purpose: Reusable Astral icon for small screens and compact layouts
// Sections: Imports, Props, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React core ---
import React from "react";

/* ==========================================================================*/
// Props Interface
/* ==========================================================================*/

interface AstralIconProps {
  className?: string;
}

/* ==========================================================================*/
// Component
/* ==========================================================================*/

/**
 * AstralIcon
 *
 * Compact Astral icon with geometric design.
 * Designed for small screens and mobile navigation.
 */
function AstralIcon({ className }: AstralIconProps) {
  return (
    <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 844 1337" aria-label="Astral Logo" className={className} fill="none">
      <path d="M181.891 1243.37L749.558 537.106" stroke="currentColor" strokeWidth="187.2" strokeLinecap="round" />
      <path d="M94.2622 799.956L661.929 93.6904" stroke="currentColor" strokeWidth="187.2" strokeLinecap="round" />
    </svg>
  );
}

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

export { AstralIcon };
