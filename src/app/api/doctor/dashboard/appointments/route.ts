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

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorID: doctorId,
      },
      include: {
        patient: true,
      },
      orderBy: {
        appointmentDate: "asc",
      },
    });

    const formattedAppointments = appointments.map((apt) => ({
      id: apt.id,
      patient: `${apt.patient.firstName} ${apt.patient.lastName}`,
      time: apt.appointmentDate.toISOString(), // Return ISO string for full date
      type: apt.type || "Appointment",
      durationMinutes: apt.durationMinutes || 60, // Default to 60 minutes if not set
    }));

    return NextResponse.json(formattedAppointments);
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
