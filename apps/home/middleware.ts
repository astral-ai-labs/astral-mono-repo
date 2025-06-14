//
import { type NextRequest } from "next/server";

// Import middleware from auth utils
import { updateSession } from "@workspace/keychain/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
