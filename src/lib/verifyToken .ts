import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
}

export const verifyToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken; // Type assertion to ensure we get the correct type
    return decoded.userId;
  } catch (error) {
    console.error("Error verifying token", error);
    return null;
  }
};
