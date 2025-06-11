/* ==========================================================================*/
// page.tsx — Dynamic blog post page with MDX imports and metadata
/* ==========================================================================*/
// Purpose: Renders blog posts using dynamic MDX imports with metadata-driven layout
// Sections: Imports, Types, Helpers, Components, Static Generation, Metadata, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React Core ----
import React from "react";

// Next.js Core ----
import { notFound } from "next/navigation";
import { Metadata } from "next";

// Local Utils ----
import { getRoleSlugs } from "@/lib/mdx-utils";

// Local Components ----
import { ResourceButton } from "@/components/ui/resource-button";
import Link from "next/link";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

interface PageProps {
  params: Promise<{ role: string }>;
}

interface RoleMetadata {
  role: string;
  datePosted: string;
  location: string;
  heroImage?: string;
}

interface MDXModule {
  default: React.ComponentType;
  metadata: RoleMetadata;
}

/* ==========================================================================*/
// Helper Functions
/* ==========================================================================*/

/**
 * loadMDXRole
 * 
 * Safely loads an MDX role with error handling.
 * 
 * @param role - The role slug to load
 * @returns Promise resolving to MDX module or null if not found
 */
async function loadMDXRole(role: string): Promise<MDXModule | null> {
  try {
    const mdxModule = await import(`@/content/careers/${role}.mdx`) as MDXModule;
    
    if (!mdxModule.default) {
      return null;
    }
    
    return mdxModule;
  } catch (error) {
    console.log(`Error loading MDX file: ${role}`, error);
    return null;
  }
}

/**
 * createMetadataFromRole
 * 
 * Creates Next.js metadata object from role metadata.
 * 
 * @param metadata - Role metadata object
 * @param role - Role slug for URL construction
 * @returns Metadata object for Next.js
 */
function createMetadataFromRole(metadata: RoleMetadata, role: string): Metadata {
  const title = metadata.role || "Some role at Astral";
  const description = metadata.role || "A role at Astral";
  const url = `/careers/${role}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      images: metadata.heroImage ? [
        {
          url: metadata.heroImage,
          width: 1200,
          height: 630,
          alt: title,
        }
      ] : [],
      authors: ["Astral"],
      publishedTime: metadata.datePosted,
      section: metadata.location,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: metadata.heroImage ? [metadata.heroImage] : [],
    },
    alternates: {
      canonical: url,
    },
  };
}

/* ==========================================================================*/
// UI Components
/* ==========================================================================*/

/**
 * Breadcrumbs
 * 
 * Navigation breadcrumbs component for role pages.
 */
function Breadcrumbs({ role }: { role: string }) {
  return (
    <div className="flex justify-center mb-6">
      <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        {/* <Link href="/careers" className="transition-colors hover:text-foreground">
          Careers
        </Link> */}
        <span className="cursor-default">Careers</span>
        <span>·</span>
        <span className="cursor-default">{role}</span>
      </nav>
    </div>
  );
}

/**
 * RoleHeader
 * 
 * Role header with title and metadata.
 */
function RoleHeader({ metadata }: { metadata: RoleMetadata }) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl xl:text-5xl font-normal text-center mb-12 max-w-4xl mx-auto leading-tight tracking-tight text-foreground">
        {metadata.role}
      </h1>
      
      {metadata.heroImage ? (
        <>
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-4xl">
              <img
                src={metadata.heroImage}
                alt={`Hero image for ${metadata.role}`}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
          
          <div className="flex justify-center mb-14">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <span>{metadata.location}</span>
              <span>·</span>
              <time dateTime={metadata.datePosted}>{metadata.datePosted}</time>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-24" />
      )}
    </>
  );
}

/**
 * RoleFooter
 * 
 * Role footer with metadata information.
 */
function RoleFooter({ metadata }: { metadata: RoleMetadata }) {
  return (
    <div className="max-w-2xl mx-auto mt-24">
      <div className="border-t border-border mb-6" />
      <div className="flex items-baseline justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span>{metadata.location}</span>
          <span>·</span>
          <time dateTime={metadata.datePosted}>{metadata.datePosted}</time>
        </div>
        <ResourceButton text="Copy Link" />
      </div>
    </div>
  );
}

/* ==========================================================================*/
// Main Component
/* ==========================================================================*/

/**
 * Role
 *
 * Dynamic role page that loads MDX files as React components
 * with metadata-driven layout and styling.
 */
async function Role({ params }: PageProps) {
  const { role } = await params;
  
  const mdxModule = await loadMDXRole(role);
  
  if (!mdxModule) {
    notFound();
  }
  
  const { default: RoleContent, metadata } = mdxModule;

  return (
    <main className="pt-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Spacer */}
        <div className="h-16" />

        {/* Breadcrumbs */}
        <Breadcrumbs role={metadata.role || "Role"} />

        {/* Role Header */}
        <RoleHeader metadata={metadata} />

        {/* Role Content */}
        <article className="max-w-xl mx-auto">
          <div className="prose prose-lg mx-auto leading-tight prose-gray dark:prose-invert">
            <RoleContent />
          </div>
        </article>

        {/* Role Footer */}
        <RoleFooter metadata={metadata} />

        {/* Bottom Spacer */}
        <div className="h-32" />
      </div>
    </main>
  );
}

/* ==========================================================================*/
// Static Generation
/* ==========================================================================*/

/**
 * generateStaticParams
 *
 * Pre-generates static params for all available roles.
 */
async function generateStaticParams() {
  const roles = await getRoleSlugs();
  
  return roles.map((role: string) => ({
    role,
  }));
}

/* ==========================================================================*/
// Metadata Generation
/* ==========================================================================*/

/**
 * generateMetadata
 *
 * Generates page metadata from MDX role frontmatter with OpenGraph support.
 */
async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { role } = await params;
  
  const mdxModule = await loadMDXRole(role);
  
  if (!mdxModule) {
    return {
      title: "Role Not Found",
      description: "The requested role could not be found.",
    };
  }
  
  return createMetadataFromRole(mdxModule.metadata, role);
}

/* ==========================================================================*/
// Configuration
/* ==========================================================================*/

// Disable dynamic params to return 404 for unknown routes
const dynamicParams = false;

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export default Role;
export { generateStaticParams, generateMetadata, dynamicParams };
