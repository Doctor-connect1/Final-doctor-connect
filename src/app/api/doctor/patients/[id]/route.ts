import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// GET endpoint to fetch patients


// DELETE endpoint to remove an appointment
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    // Verify the doctor exists
    const doctor = await prisma.doctor.findFirst({
      where: { userId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    // Convert patient ID to number
    const patientId = parseInt(params.id);
    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: "Invalid patient ID" },
        { status: 400 }
      );
    }

    // Find and delete the appointment for this patient
    const appointment = await prisma.appointment.findFirst({
      where: {
        doctorID: doctor.id,
        patientID: patientId,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    await prisma.appointment.delete({
      where: { id: appointment.id },
    });

    return NextResponse.json({ message: "Appointment deleted successfully" });
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return NextResponse.json(
      { error: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
