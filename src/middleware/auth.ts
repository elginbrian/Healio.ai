import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function authMiddleware(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return new NextResponse(JSON.stringify({ success: false, message: "Akses ditolak: Token tidak disediakan" }), { status: 401, headers: { "content-type": "application/json" } });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);

    return NextResponse.next();
  } catch (err) {
    return new NextResponse(JSON.stringify({ success: false, message: "Akses ditolak: Token tidak valid" }), { status: 401, headers: { "content-type": "application/json" } });
  }
}

export const config = {
  matcher: ["/api/users/:path*", "/api/expenses/:path*"],
};
