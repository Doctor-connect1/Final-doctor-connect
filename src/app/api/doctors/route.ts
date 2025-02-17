import  prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {
        user: true, // Include related user data
        profileMedia: true // Include profile picture if needed
      }
    });

    // Log the fetched data on the server side
    //console.log('Fetched doctors from database:', doctors);

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}
