import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || '2efedbe7bf22ec6f383cdc5c7ddbbe42'
);

export interface AdminUser {
  username: string;
  name: string;
  role: string;
}

export async function verifyTokenEdge(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminUser;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function generateTokenEdge(user: AdminUser): Promise<string> {
  return await new SignJWT({ ...user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
}
