import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params;
    const parsedId = parseInt(patientId);

    if (isNaN(parsedId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid patient ID' 
      }, { status: 400 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        patientID: parsedId,
      },
      include: {
        doctor: {
          include: {        
        
            specialty: true,
          
          }
        }
      },
      orderBy: {
        appointmentDate: 'desc',
      }
    });

    return NextResponse.json(
      appointments
    , { status: 200 });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch appointments' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
