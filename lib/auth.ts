import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) return cookieToken;

  return null;
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = getTokenFromRequest(request);
  if (!token) return false;

  const decoded = verifyToken(token);
  return decoded?.role === "admin";
}
