/* ==========================================================================*/
// page.tsx — Resources page with animated blog post list
/* ==========================================================================*/
// Purpose: Displays a list of blog posts with animated background on hover
// Sections: Imports, Animation Constants, Component, Exports

/* ==========================================================================*/
// Imports
/* ==========================================================================*/

// React Core ----
import React from "react";
import Link from "next/link";

// External Packages ----
import * as motion from "motion/react-client"
// Local Components ----
import { AnimatedBackground } from "@workspace/ui/components/animated-background";
import { TextEffect } from "@workspace/ui/components/text-effect";

// Local Utils ----
import { getPosts } from "@/lib/mdx-utils";

/* ==========================================================================*/
// Animation Constants
/* ==========================================================================*/

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

const TEXT_EFFECT_CONFIG = {
  subtitle: {
    preset: "fade" as const,
    delay: 0.2,
    speedReveal: 2.2,
    speedSegment: 1,
    segmentTransition: { duration: 0.5, ease: "easeOut" },
  },
};

/* ==========================================================================*/
// Component
/* ==========================================================================*/

export default async function ResourcesPage() {
  const blogPosts = await getPosts();

  console.log(blogPosts);

  return (
    <div className="relative bg-background">
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-4xl py-32 sm:py-40">
          <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} initial="hidden" animate="visible">
            {/* Page Header --- */}
            <div className="text-center mb-16">
              <h1 className="text-4xl text-balance sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal">
                Resources
              </h1>
              <TextEffect 
                className="mt-6 text-pretty text-lg md:text-xl text-muted-foreground"
                preset={TEXT_EFFECT_CONFIG.subtitle.preset} 
                as="p" 
                per="char" 
                delay={TEXT_EFFECT_CONFIG.subtitle.delay} 
                speedReveal={TEXT_EFFECT_CONFIG.subtitle.speedReveal} 
                segmentTransition={TEXT_EFFECT_CONFIG.subtitle.segmentTransition}
              >
                Insights and perspectives on building with AI
              </TextEffect>
            </div>

            {/* Blog Posts List --- */}
            <div className="max-w-3xl mx-auto">
              <AnimatedBackground
                enableHover
                className="h-full w-full rounded-xl bg-muted/50"
                transition={{
                  type: "spring",
                  bounce: 0,
                  duration: 0.2,
                }}
              >
                {blogPosts.map((post: { uid: string; title: string; description: string; link: string }) => (
                  <Link key={post.uid} className="block -mx-4 rounded-xl px-6 py-6 transition-colors hover:bg-transparent" href={post.link} data-id={post.uid}>
                    <div className="flex flex-col space-y-3 relative z-10">
                      <h2 className="text-xl font-medium text-foreground">
                        {post.title}
                      </h2>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </AnimatedBackground>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
