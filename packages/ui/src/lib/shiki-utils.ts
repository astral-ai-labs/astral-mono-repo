/* ==========================================================================*/
// shiki-utils.ts — Syntax highlighting utilities using Shiki
/* ==========================================================================*/
// Purpose: Provides code highlighting functionality with Shiki highlighter
// Sections: Imports, Types, Utilities, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages ---
import { createHighlighter, type BundledLanguage, type BundledTheme } from 'shiki/bundle/web';

/* ==========================================================================*/
// Types
/* ==========================================================================*/

type HighlighterInstance = Awaited<ReturnType<typeof createHighlighter>>;

/* ==========================================================================*/
// State
/* ==========================================================================*/

let highlighterInstance: HighlighterInstance | null = null;

/* ==========================================================================*/
// Utilities
/* ==========================================================================*/

/**
 * getHighlighter
 *
 * Gets or creates a singleton Shiki highlighter instance.
 *
 * @returns Promise resolving to highlighter instance
 */
async function getHighlighter(): Promise<HighlighterInstance> {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: ['javascript', 'typescript', 'python', 'bash', 'json', 'html', 'css']
    });
  }
  return highlighterInstance;
}

/**
 * highlight
 *
 * Highlights code using Shiki with specified language and theme.
 *
 * @param code - Code string to highlight
 * @param language - Programming language for syntax highlighting
 * @param theme - Color theme to apply
 * @returns Promise resolving to highlighted HTML string
 */
async function highlight(
  code: string, 
  language: BundledLanguage = 'javascript', 
  theme: BundledTheme = 'github-dark'
): Promise<string> {
  const highlighter = await getHighlighter();
  
  return highlighter.codeToHtml(code, {
    lang: language,
    theme: theme
  });
}

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export { highlight, getHighlighter };
export type { BundledLanguage, BundledTheme };