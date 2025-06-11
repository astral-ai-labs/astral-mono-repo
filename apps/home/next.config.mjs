/* ==========================================================================*/
// next.config.mjs — Next.js configuration with MDX support
/* ==========================================================================*/
// Purpose: Configures Next.js build settings, transpilation, and MDX processing
// Sections: Imports, Configuration, Plugin Setup, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// External Packages ----
import createMDX from "@next/mdx";

/* ==========================================================================*/
// Configuration
/* ==========================================================================*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  transpilePackages: ["@workspace/ui"],
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      },
    ],
  },
};

/* ==========================================================================*/
// Plugin Setup
/* ==========================================================================*/

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/* ==========================================================================*/
// Exports
/* ==========================================================================*/

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
