/* ==========================================================================*/
// posts.ts — Post utilities for static generation
/* ==========================================================================*/
// Purpose: Provides utilities for getting post slugs for static generation
// Sections: Imports, Types, Utils, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// Node.js Core ----
import fs from "fs";
import path from "path";

/* ==========================================================================*/
// Types
/* ==========================================================================*/

export interface PostMetadata {
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  heroImage?: string;
  subtitle?: string;
}

export interface RoleMetadata {
  role: string;
  datePosted: string;
  location: string;
  heroImage?: string;
}

/* ==========================================================================*/
// Configuration
/* ==========================================================================*/

const contentDirectory = path.join(process.cwd(), "content");
const resourcesDirectory = path.join(contentDirectory, "resources");
const careersDirectory = path.join(contentDirectory, "careers");

/* ==========================================================================*/
// Utility Functions
/* ==========================================================================*/

/**
 * getPostSlugs
 *
 * Gets all available post slugs for static generation.
 * Used by generateStaticParams in the page component.
 */
export async function getPostSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(resourcesDirectory)) {
      console.log(`Resources directory not found: ${resourcesDirectory}`);
      return [];
    }

    const files = fs.readdirSync(resourcesDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Found resource MDX files:`, mdxFiles);

    return mdxFiles.map((file) => file.replace(".mdx", ""));
  } catch (error) {
    console.error("Error getting post slugs:", error);
    return [];
  }
}

/**
 * getRoleSlugs
 *
 * Gets all available role slugs for static generation.
 * Used by generateStaticParams in the careers page component.
 */
export async function getRoleSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(careersDirectory)) {
      console.log(`Careers directory not found: ${careersDirectory}`);
      return [];
    }

    const files = fs.readdirSync(careersDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    console.log(`Found career MDX files:`, mdxFiles);

    return mdxFiles.map((file) => file.replace(".mdx", ""));
  } catch (error) {
    console.error("Error getting role slugs:", error);
    return [];
  }
}

/**
 * slugToTitle
 *
 * Converts a kebab-case slug to a proper title.
 */
function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * getPosts
 *
 * Gets all posts with metadata for display on resources page.
 * Returns title (generated from slug), description, and link for each post.
 * Limited to 10 posts maximum.
 */
export async function getPosts(): Promise<{
  uid: string;
  title: string;
  description: string;
  link: string;
}[]> {
  try {
    const slugs = await getPostSlugs();
    const posts = [];

    for (const slug of slugs.slice(0, 10)) {
      const title = slugToTitle(slug);
      
      posts.push({
        uid: slug,
        title: title,
        description: `A blog on ${title}`,
        link: `/resources/${slug}`,
      });
    }

    return posts;
  } catch (error) {
    console.error("Error getting posts:", error);
    return [];
  }
}

/**
 * getRoles
 *
 * Gets all roles with metadata for display on careers page.
 * Returns title (generated from slug), description, and link for each role.
 * Limited to 10 roles maximum.
 */
export async function getRoles(): Promise<{
  uid: string;
  title: string;
  description: string;
  link: string;
}[]> {
  try {
    const slugs = await getRoleSlugs();
    const roles = [];

    for (const slug of slugs.slice(0, 10)) {
      const title = slugToTitle(slug);
      
      roles.push({
        uid: slug,
        title: title,
        description: `Join our team as a ${title}`,
        link: `/careers/${slug}`,
      });
    }

    return roles;
  } catch (error) {
    console.error("Error getting roles:", error);
    return [];
  }
}

