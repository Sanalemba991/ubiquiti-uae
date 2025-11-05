import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || '2efedbe7bf22ec6f383cdc5c7ddbbe42';

export interface AdminUser {
  username: string;
  name: string;
  role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user: AdminUser): string => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): AdminUser | null => {
  try {
    console.log('Verifying token with secret:', JWT_SECRET.substring(0, 10) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    console.log('Token verified successfully:', decoded.username);
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

// Admin credentials - In production, this should be in a database
export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || 'admin',
  password: process.env.ADMIN_PASSWORD || 'securepassword123',
  name: 'Adeeb Jamil',
  role: 'Backend Developer'
};
