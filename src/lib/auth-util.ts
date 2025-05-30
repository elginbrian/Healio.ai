import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
}

export function getUserIdFromToken(authHeader: string | null | undefined): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET tidak terdefinisi.");
      return null;
    }

    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}
