/* ==========================================================================*/
// page.tsx — Careers page with animated role list
/* ==========================================================================*/
// Purpose: Displays a list of job roles with animated background on hover
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
import { getRoles } from "@/lib/mdx-utils";

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

export default async function CareersPage() {
  const jobRoles = await getRoles();

  console.log(jobRoles);

  return (
    <div className="relative bg-background">
      <div className="relative isolate px-6 lg:px-8">
        <div className="mx-auto max-w-3xl lg:max-w-4xl py-32 sm:py-40">
          <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION} initial="hidden" animate="visible">
            {/* Page Header --- */}
            <div className="text-center mb-16">
              <h1 className="text-4xl text-balance sm:text-5xl md:text-6xl tracking-tight text-foreground font-normal">
                Careers
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
                You thrive on autonomy, hold strong opinions about product quality, and care deeply about creating things that genuinely improve the human experience.
              </TextEffect>
            </div>

            {/* Company Culture & Role Descriptions --- */}
            <div className="max-w-2xl mx-auto mb-20">
              <div className="prose prose-lg prose-gray dark:prose-invert mx-auto">
                <p className="text-base leading-relaxed text-foreground mb-6">
                  I'm hiring for three foundational roles. In all of them, leveraging AI in your workflow is non-negotiable. You thrive on autonomy, hold strong opinions about product quality, and care deeply about creating things that genuinely improve the human experience.
                </p>
                
                <p className="text-base leading-relaxed text-foreground mb-8">
                  I can't emphasize this enough: I'm looking for people who are relentless about building something extraordinary. The standard here is high and working at Astral will be very hard.
                </p>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">1. Frontend Engineer (Design-Obsessed)</h3>
                    <p className="text-base leading-relaxed text-muted-foreground mb-3">
                      You live at the intersection of UX and engineering. You're obsessed with great design, user experience, and how people actually interact with software. You understand the nuances of client/server rendering and component architecture, and you know Next.js (especially React 19), shadcn, Tailwind CSS v4, and animation/motion libraries inside and out. You care about details, aesthetics, and aren't afraid to call something ugly, then reimagine how to make it beautiful.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Bonus: Experience with caching, server actions, or bringing AI into product interfaces.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">2. Backend Engineer (AI & Cloud-Native APIs)</h3>
                    <p className="text-base leading-relaxed text-muted-foreground mb-3">
                      You have built and maintained production APIs and love thinking about durability, scale, and reliability. You're comfortable with Python (FastAPI) or Typescript, have worked with serverless compute environments, and know your way around IaC tools (Pulumi, Terraform, etc). You're opinionated about backend design, obsessed with making systems both elegant and robust, and excited to apply AI to every part of your workflow.
                    </p>
                    <p className="text-sm text-muted-foreground italic">
                      Bonus: Experience scaling APIs, running production workloads, or integrating AI services.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-4">3. Generalist / Founding Team Member</h3>
                    <p className="text-base leading-relaxed text-muted-foreground mb-3">
                      You're a phenomenal communicator, relentlessly curious, and see across disciplines. The intersection of humanities, arts, and sciences energizes you. You bring an eye for aesthetics, think in systems, and can switch contexts rapidly. Maybe you've never fit in at big orgs, or had a slight disdain for them. You care about the why behind the product and want to help shape culture and vision from day one.
                    </p>
                  </div>
                </div>

                <div className="mt-10 p-6 rounded-lg bg-muted/30 border border-border">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Traits We Value:</h4>
                  <ul className="space-y-3 text-base text-muted-foreground">
                    <li>• You might be overconfident, but you're also humble and hungry to learn. New ideas gnaw at you until you truly understand them.</li>
                    <li>• You aren't afraid to call something crap, even if it comes from a billion-dollar company. Then you'll reimagine it and build something better.</li>
                    <li>• You care about the human experience more than anyone you know, and you thrive at the intersection of the humanities and sciences.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Job Roles List --- */}
            <div className="max-w-3xl mx-auto">
              {jobRoles.length > 0 ? (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-center text-foreground mb-8">Open Positions</h2>
                  <AnimatedBackground
                    enableHover
                    className="h-full w-full rounded-xl bg-muted/50"
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: 0.2,
                    }}
                  >
                    {jobRoles.map((role: { uid: string; title: string; description: string; link: string }) => (
                      <Link key={role.uid} className="block -mx-4 rounded-xl px-6 py-6 transition-colors hover:bg-transparent" href={role.link} data-id={role.uid}>
                        <div className="flex flex-col space-y-3 relative z-10">
                          <h3 className="text-xl font-medium text-foreground">
                            {role.title}
                          </h3>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {role.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </AnimatedBackground>
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium text-foreground mb-4">
                    No open positions at the moment
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Check back soon for exciting opportunities to join our team.
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
} 