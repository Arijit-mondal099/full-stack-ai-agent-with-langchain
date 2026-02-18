import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("access-token")?.value;
  const { pathname } = request.nextUrl;

  // If logged in and trying to access "/" redirect to /chat
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  // If not logged in and trying to access "/chat" redirect to "/"
  if (!token && pathname.startsWith("/chat")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*"],
};
