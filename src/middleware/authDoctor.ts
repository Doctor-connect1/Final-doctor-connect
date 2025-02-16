import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function authenticate(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return { error: "Unauthorized: No token provided", status: 401 };
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      role: string;
    };
    if (!decoded || !decoded.userId) {
      return { error: "Unauthorized: Invalid token", status: 401 };
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: decoded.userId },
    });

    return { userId: decoded.userId, isDoctor: !!doctor };
  } catch (error) {
    console.error("Authentication error:", error);
    return { error: "Forbidden: Invalid token", status: 403 };
  }
}
