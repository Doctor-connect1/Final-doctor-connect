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

    // Get all appointments for this doctor, ordered by date
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorID: doctor.id,
      },
      include: {
        patient: true,
      },
      orderBy: {
        appointmentDate: "desc",
      },
    });

    // Format the response
    const history = appointments.map((apt) => ({
      id: apt.id,
      patientName: `${apt.patient.firstName} ${apt.patient.lastName}`,
      date: apt.appointmentDate.toISOString(),
      status: apt.status === "confirmed" ? "Completed" : "Cancelled",
    }));

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching appointment history:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointment history" },
      { status: 500 }
    );
  }
}
