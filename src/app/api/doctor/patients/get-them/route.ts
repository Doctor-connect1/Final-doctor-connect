import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// GET endpoint to fetch all patients for a doctor
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
      select: { id: true },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Get all patients who have appointments with this doctor
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorID: doctor.id,
      },
      include: {
        patient: true,
      },
      distinct: ["patientID"],
      orderBy: {
        patient: {
          lastName: "asc",
        },
      },
    });

    // Format the response with patient details and last visit
    const patients = appointments.map((apt) => ({
      id: apt.patient.id.toString(),
      firstName: apt.patient.firstName,
      lastName: apt.patient.lastName,
      email: apt.patient.email,
      phone: apt.patient.phone,
      lastVisit: apt.appointmentDate.toISOString(),
    }));

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}
