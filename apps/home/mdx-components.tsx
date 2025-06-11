/* ==========================================================================*/
// mdx-components.tsx — Global MDX component overrides
/* ==========================================================================*/
// Purpose: Defines custom React components to replace default HTML elements in MDX
// Sections: Imports, Component Overrides, Footnote Components, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React Core ----
import type { MDXComponents } from 'mdx/types'

/* ==========================================================================*/
// Footnote Components
/* ==========================================================================*/

/**
 * FootnoteRef
 * 
 * Inline footnote reference component.
 * Usage: <FootnoteRef id="1" />
 */
function FootnoteRef({ id }: { id: string }) {
  return (
    <sup className='text-[10px] ml-[1px]'>
      <a
        href={`#footnote-${id}`}
        id={`footnote-ref-${id}`}
        className="text-primary hover:text-primary/80 no-underline transition-colors"
        aria-describedby="footnote-label"
      >
        {id}
      </a>
    </sup>
  );
}

/**
 * FootnoteSection
 * 
 * Footnotes section wrapper component.
 * Usage: <FootnoteSection>footnote content</FootnoteSection>
 */
function FootnoteSection({ children }: { children: React.ReactNode }) {
  return (
    <section className="mt-16 pt-8 border-t border-border">
      <h2 id="footnote-label" className="sr-only">
        Footnotes
      </h2>
      <ol className="space-y-4 text-sm text-muted-foreground">
        {children}
      </ol>
    </section>
  );
}

/**
 * Footnote
 * 
 * Individual footnote item component.
 * Usage: <Footnote id="1">Footnote content here</Footnote>
 */
function Footnote({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <li id={`footnote-${id}`} className="flex gap-2">
      <span className="text-primary font-medium min-w-[1.5rem]">{id}.</span>
      <div className="flex-1">
        <span>{children}</span>
        <a
          href={`#footnote-ref-${id}`}
          className="ml-2 text-primary hover:text-primary/80 no-underline transition-colors"
          aria-label="Back to content"
        >
          ↩
        </a>
      </div>
    </li>
  );
}

/* ==========================================================================*/
// Component Overrides
/* ==========================================================================*/

/**
 * useMDXComponents
 * 
 * Provides custom React components that override default HTML elements in MDX.
 * These components will be used across all MDX files in the application.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Typography Components ----
    h1: ({ children }) => (
      <h1 className="text-3xl font-semibold mb-10 mt-10 text-foreground dark:text-foreground leading-tight tracking-tight">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-semibold mb-8 mt-8 text-foreground dark:text-foreground leading-tight tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-8 mt-8 text-foreground dark:text-foreground leading-tight tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mb-8 mt-8 text-foreground dark:text-foreground leading-tight tracking-normal">
        {children}
      </h4>
    ),
    
    // Text Components ----
    p: ({ children }) => (
      <p className="text-[15px] mb-4 leading-relaxed text-foreground dark:text-foreground/90">
        {children}
      </p>
    ),
    
    // Link Components ----
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary font-medium hover:text-primary/80 underline underline-offset-3 transition-colors"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    
    // List Components ----
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-7 space-y-2 text-foreground">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-7 space-y-2 text-foreground">
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className="mb-2 leading-relaxed text-base">
        {children}
      </li>
    ),
    
    // Quote Components ----
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-border pl-6 my-10 italic text-muted-foreground text-base leading-relaxed">
        {children}
      </blockquote>
    ),
    
    // Code Components ----
    code: ({ children }) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground font-medium">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="bg-muted p-6 rounded-lg overflow-x-auto mb-7 text-sm">
        {children}
      </pre>
    ),
    
    // Separator Components ----
    hr: () => (
      <hr className="border-border my-14" />
    ),

    // Footnote Components ----
    FootnoteRef,
    FootnoteSection,
    Footnote,
    
    ...components,
  }
}
  