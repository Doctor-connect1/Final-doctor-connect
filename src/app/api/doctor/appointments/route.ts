import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };
    const userId = decoded.userId;

    // Find doctor ID from user ID
    const doctor = await prisma.doctor.findFirst({
      where: { userId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const { patientId, start, end } = await request.json();

    // Calculate duration in minutes
    const durationMinutes =
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60);

    // Create new appointment
    const appointment = await prisma.appointment.create({
      data: {
        doctorID: doctor.id,
        patientID: patientId,
        appointmentDate: new Date(start),
        status: "confirmed",
        durationMinutes: 1,
      },
    });

    return NextResponse.json({
      id: appointment.id,
      start: appointment.appointmentDate,
      end: new Date(new Date(start).getTime() + durationMinutes * 60 * 1000),
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
