// pages/api/doctors/search.ts

import prisma from '@/lib/prisma'; // Assuming you have Prisma set up

export async function GET(request: Request) {
  try {
    // Parse the query parameters from the URL
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || ''; // Get 'name' from query string (default to empty string if not present)
    const specialty = searchParams.get('specialty') || ''; // Get 'specialty' from query string (default to empty string if not present)
    // const isVerified = searchParams.get('isVerified') === 'true'; // 'true' or 'false' for availability filter

    // Query the database with the filtered conditions
    const doctors = await prisma.doctor.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                firstName: {
                  contains: name, // Case-insensitive search for firstName
                },
              },
              {
                lastName: {
                  contains: name, // Case-insensitive search for lastName
                },
              },
            ],
          },
          {
            specialty: {
              contains: specialty, // Case-insensitive search for specialty
            },
          },
          // {
          //   isVerified: isVerified, // Only get available doctors if isAvailable is true
          // },
        ],
      },
    });

    // Return the filtered doctors
    return new Response(JSON.stringify({ success: true, data: doctors }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error searching doctors:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch doctors' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
