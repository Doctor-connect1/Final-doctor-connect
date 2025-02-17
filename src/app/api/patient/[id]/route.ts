import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Await params before accessing id
  const { id } = await params;  // Ensure params is awaited

  const parsedId = parseInt(id);
  try {
    if (isNaN(parsedId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid patient ID' 
      }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: parsedId },
      include: {
        profileMedia: true,
        user: {
          select: {
            meetingPrice: true,
            role: true
          }
        }
      }
    });

    if (!patient) {
      return NextResponse.json({ 
        success: false, 
        error: 'Patient not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      patient 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch patient' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const parsedId = parseInt(id);
    const body = await request.json();
    
    const { 
      firstName, 
      lastName, 
      phone,
      medicalHistory,
      bio 
    } = body;

    if (isNaN(parsedId)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid patient ID' 
      }, { status: 400 });
    }

    // Update only the specified fields
    const updatedPatient = await prisma.patient.update({
      where: { id: parsedId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone && { phone }),
        ...(medicalHistory && { medicalHistory }),
        ...(bio && { bio })
      },
      include: {
        profileMedia: true // Include profile media in response
      }
    });

    return NextResponse.json({ 
      success: true, 
      patient: updatedPatient 
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update patient' 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
