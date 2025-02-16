import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

const prisma = new PrismaClient();

// Make sure to export the function with this exact name
export async function POST(request: Request) {
  console.log("Login route called");
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    // Compare password directly with hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 400 }
      );
    }

    // Fix JWT signing
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not defined");
    }

    const signOptions: SignOptions = {
      expiresIn: "8h",
    };

    const token = jwt.sign(
      { userId: existingUser.id, role: existingUser.role },
      jwtSecret,
      signOptions
    );
    return NextResponse.json(
      {
        message: "User logged in successfully",
        token: token,
        role: existingUser.role, // Include role in the response
      },
      { status: 200 } // Use status 200 for successful login
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
