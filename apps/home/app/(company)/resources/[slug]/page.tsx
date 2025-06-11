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
import Image from "next/image";

// Local Utils ----
import { getPostSlugs } from "@/lib/mdx-utils";

// Local Components ----
import { ResourceButton } from "@/components/ui/resource-button";
import Link from "next/link";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface PostMetadata {
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  heroImage?: string;
}

interface MDXModule {
  default: React.ComponentType;
  metadata: PostMetadata;
}

/* ==========================================================================*/
// Helper Functions
/* ==========================================================================*/

/**
 * loadMDXPost
 * 
 * Safely loads an MDX post with error handling.
 * 
 * @param slug - The post slug to load
 * @returns Promise resolving to MDX module or null if not found
 */
async function loadMDXPost(slug: string): Promise<MDXModule | null> {
  try {
    const mdxModule = await import(`@/content/resources/${slug}.mdx`) as MDXModule;
    
    if (!mdxModule.default) {
      return null;
    }
    
    return mdxModule;
  } catch (error) {
    console.log(`Error loading MDX file: ${slug}`, error);
    return null;
  }
}

/**
 * createMetadataFromPost
 * 
 * Creates Next.js metadata object from post metadata.
 * 
 * @param metadata - Post metadata object
 * @param slug - Post slug for URL construction
 * @returns Metadata object for Next.js
 */
function createMetadataFromPost(metadata: PostMetadata, slug: string): Metadata {
  const title = metadata.title || "Untitled";
  const description = metadata.excerpt || "A blog post";
  const url = `/resources/${slug}`;
  
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
      authors: [metadata.author],
      publishedTime: metadata.date,
      section: metadata.category,
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
 * Navigation breadcrumbs component for blog posts.
 */
function Breadcrumbs({ category }: { category: string }) {
  return (
    <div className="flex justify-center mb-6">
      <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
        {/* <Link href="/resources" className="transition-colors hover:text-foreground">
          Resources
        </Link> */}
        <span className="cursor-default">Resources</span>
        <span>·</span>
        <span className="cursor-default">{category}</span>
      </nav>
    </div>
  );
}

/**
 * PostHeader
 * 
 * Blog post header with title and metadata.
 */
function PostHeader({ metadata }: { metadata: PostMetadata }) {
  return (
    <>
      <h1 className="text-3xl md:text-4xl xl:text-5xl font-normal text-center mb-12 max-w-4xl mx-auto leading-tight tracking-tight text-foreground">
        {metadata.title}
      </h1>
      
      {metadata.heroImage ? (
        <>
          <div className="flex justify-center mb-12">
            <div className="w-full max-w-4xl">
              <Image
                src={metadata.heroImage}
                alt={`Hero image for ${metadata.title}`}
                className="w-full h-auto rounded-2xl"
                width={1200}
                height={630}
                priority={true}
              />
            </div>
          </div>
          
          <div className="flex justify-center mb-14">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <span>{metadata.author}</span>
              <span>·</span>
              <time dateTime={metadata.date}>{metadata.date}</time>
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
 * PostFooter
 * 
 * Blog post footer with author information.
 */
function PostFooter({ metadata }: { metadata: PostMetadata }) {
  return (
    <div className="max-w-2xl mx-auto mt-24">
      <div className="border-t border-border mb-6" />
      <div className="flex items-baseline justify-between text-sm text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span>{metadata.author}</span>
          <span>·</span>
          <time dateTime={metadata.date}>{metadata.date}</time>
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
 * Resource
 *
 * Dynamic resource page that loads MDX files as React components
 * with metadata-driven layout and styling.
 */
async function Resource({ params }: PageProps) {
  const { slug } = await params;
  
  const mdxModule = await loadMDXPost(slug);
  
  if (!mdxModule) {
    notFound();
  }
  
  const { default: ResourceContent, metadata } = mdxModule;

  return (
    <main className="pt-16">
      <div className="max-w-3xl mx-auto px-6">
        {/* Spacer */}
        <div className="h-16" />

        {/* Breadcrumbs */}
        <Breadcrumbs category={metadata.category || "Article"} />

        {/* Post Header */}
        <PostHeader metadata={metadata} />

        {/* Article Content */}
        <article className="max-w-xl mx-auto">
          <div className="prose prose-lg mx-auto leading-tight prose-gray dark:prose-invert">
            <ResourceContent />
          </div>
        </article>

        {/* Post Footer */}
        <PostFooter metadata={metadata} />

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
 * Pre-generates static params for all available blog posts.
 */
async function generateStaticParams() {
  const slugs = await getPostSlugs();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

/* ==========================================================================*/
// Metadata Generation
/* ==========================================================================*/

/**
 * generateMetadata
 *
 * Generates page metadata from MDX post frontmatter with OpenGraph support.
 */
async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  const mdxModule = await loadMDXPost(slug);
  
  if (!mdxModule) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }
  
  return createMetadataFromPost(mdxModule.metadata, slug);
}

/* ==========================================================================*/
// Configuration
/* ==========================================================================*/

// Disable dynamic params to return 404 for unknown routes
const dynamicParams = false;

/* ==========================================================================*/
// Public API Exports
/* ==========================================================================*/

export default Resource;
export { generateStaticParams, generateMetadata, dynamicParams };
