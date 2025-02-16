import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { subDays, format, startOfDay, endOfDay } from "date-fns";
import { log } from "console";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;
    console.log("userId",userId);
    
    // Find doctor ID from user ID
    const doctor = await prisma.doctor.findFirst({
      where: { userId: userId },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const doctorId = doctor.id;
    console.log("doctorId",doctorId);
    // Get visits for the last 7 days
    const chartData = await Promise.all(
      Array.from({ length: 7 }).map(async (_, i) => {
        const date = subDays(new Date(), 6 - i);
        const start = startOfDay(date);
        const end = endOfDay(date);

        const count = await prisma.appointment.count({
          where: {
            doctorID: doctorId,
            createdAt: {
              gte: start,
              lte: end,
            },
          },
        });

        return {
          name: format(date, "EEE"),
          visits: count,
        };
      })
    );

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Error fetching visits data:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
