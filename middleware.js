import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const hasValidClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.startsWith("pk_") &&
  process.env.CLERK_SECRET_KEY?.startsWith("sk_");

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)'
]);

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhook(.*)',
  '/privacy',
  '/terms'
]);

export default function middleware(req) {
  if (!hasValidClerkKeys) {
    return NextResponse.next();
  }
  return clerkMiddleware((auth, request) => {
    if (isProtectedRoute(request)) {
      auth().protect();
    }
  })(req);
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
