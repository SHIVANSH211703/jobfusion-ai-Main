import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(route + "/")
  );

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/jobs/:path*",
    "/applications/:path*",
    "/resumes/:path*",

    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};