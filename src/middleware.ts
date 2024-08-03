import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = path === "/login" || path === "/signup" || path === "/resetpassword";

  const token = request.cookies.get("token")?.value || "";

  if(isPublicPath && token) {
    console.log("have token")
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }

  if(!isPublicPath && !token) {
    console.log("no token")
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/profile",
    "/profile/:id*",
    "/login",
    "/signup",
    "/verifyemail",
    "/resetpassword"
  ],
}