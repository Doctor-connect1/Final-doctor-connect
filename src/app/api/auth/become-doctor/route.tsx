import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Define Types for Doctor Data and Request Body
interface DoctorData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  specialty: string;
  experience: number;
  bio: string;
  locationLatitude: number;
  locationLongitude: number;
  profilePicture?: string; // Assuming optional
}

interface Decoded {
  userId: number;
  role: string;
}

// Handle POST request for doctor registration
export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "JWT_SECRET environment variable is missing" },
      { status: 500 }
    );
  }

  let decoded: Decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET) as Decoded; // Type casting to match the Decoded interface
  } catch (error) {
    console.error("Error verifying token", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  // Extract doctor data from the request body
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    profilePicture,
    specialty,
    experience,
    bio,
    locationLatitude,
    locationLongitude,
  }: DoctorData = await req.json();

  try {
    // Check if the phone number already exists
    const existingDoctor = await prisma.doctor.findUnique({
      where: { phone: phone }, // Check for an existing doctor with the same phone number
    });

    if (existingDoctor) {
      // If the phone number is already taken, return an error
      return NextResponse.json(
        { error: "Phone number already exists" },
        { status: 400 }
      );
    }

    // If phone number doesn't exist, proceed to create the new doctor
    const doctor = await prisma.doctor.create({
      data: {
        userId: decoded.userId, // Set userId from token
        firstName,
        lastName,
        email,
        password,
        phone,
        profilePicture,
        specialty,
        experience,
        bio,
        locationLatitude,
        locationLongitude,
      },
    });

    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
