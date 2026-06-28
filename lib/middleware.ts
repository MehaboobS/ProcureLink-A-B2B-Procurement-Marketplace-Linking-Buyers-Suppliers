import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
const token = req.cookies.get('session')?.value;

// ❌ Not logged in
if (!token) {
return NextResponse.redirect(new URL('/signin', req.url));
}

try {
const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
const role = decoded.role;


const pathname = req.nextUrl.pathname;

// ✅ Buyer-only route
if (pathname.startsWith('/create-requirement')) {
  if (role !== 'BUYER') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

// ✅ Supplier-only route
if (pathname.startsWith('/create-catalog')) {
  if (role !== 'SUPPLIER') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
}

return NextResponse.next();

} catch (error) {
return NextResponse.redirect(new URL('/signin', req.url));
}
}

export const config = {
matcher: ['/create-requirement', '/create-catalog']
};
