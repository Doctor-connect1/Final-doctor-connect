import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Find doctor ID from user ID
    const doctor = await prisma.doctor.findFirst({
      where: { userId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const doctorId = doctor.id;

    // Get total visits
    const totalVisits = await prisma.appointment.count({
      where: { doctorID: doctorId },
    });

    // Get new patients (first-time visitors)
    const newPatients = await prisma.appointment.groupBy({
      by: ["patientID"],
      where: {
        doctorID: doctorId,
        status: "confirmed",
      },
      _count: true,
      having: {
        patientID: {
          _count: {
            equals: 1,
          },
        },
      },
    });

    // Get old patients (returning visitors)
    const oldPatients = await prisma.appointment.groupBy({
      by: ["patientID"],
      where: {
        doctorID: doctorId,
        status: "confirmed",
      },
      _count: true,
      having: {
        patientID: {
          _count: {
            gt: 1,
          },
        },
      },
    });

    // Calculate revenue (assuming each appointment is $100 for simplicity)
    const revenue = totalVisits * 100;

    return NextResponse.json({
      total: totalVisits,
      newPatients: {
        count: newPatients.length,
        growth: Math.round((newPatients.length / totalVisits) * 100) || 0,
      },
      oldPatients: {
        count: oldPatients.length,
        growth: Math.round((oldPatients.length / totalVisits) * 100) || 0,
      },
      revenue,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error: ", error.stack);
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
