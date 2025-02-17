import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();

  // Here you would typically:
  // 1. Validate the email
  // 2. Store it in your database or email service
  // 3. Handle any errors

  try {
    // Simulate a successful subscription
    return NextResponse.json(
      { message: 'Thank you for subscribing!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
} 