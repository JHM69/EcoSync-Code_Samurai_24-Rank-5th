
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname === '/' ||
    req.nextUrl.pathname !== '/login'
  ) {
    //  check if the user is authenticated

    const user = localStorage.getItem('user');
     
    if (!user) {
      const u = `/login?redirect=${req.nextUrl.pathname}`;
      return NextResponse.redirect(u);
    }
  }
}
