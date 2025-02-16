import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

const prisma = new PrismaClient();

// Make sure to export the function with this exact name
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { firstName, lastName, username, email, password, role, phone, medicalHistory, dateOfBirth, gender, profilePicture, bio } = body;

        // Validate required fields
        if (!username || !email || !password || !role) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists (email or username)
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email or username' },
                { status: 400 }
            );
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const User = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role,
            },
        });

        // Log the User object to verify the properties
        console.log('Created User:', User);

        // Ensure User.id and User.role are valid before signing JWT
        if (!User || !User.id || !User.role) {
            console.error('Error: User id or role is missing. User:', User);
            return NextResponse.json(
                { message: 'User ID or role is missing' },
                { status: 500 }
            );
        }

        // Create patient if role is Patient
        let patient = null;
        if (User.role === 'Patient') {
            try {
                patient = await prisma.patient.create({
                    data: {
                        userId: User.id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        dateOfBirth,
                        medicalHistory,
                        gender,
                        bio,
                        profilePicture,
                        password
                    }
                });
            } catch (err) {
                console.log("Error creating patient: ", err);
                // Log error but don't fail the signup process
            }
        }

        // JWT secret and options setup
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return NextResponse.json(
                { message: 'JWT_SECRET is not defined' },
                { status: 500 }
            );
        }

        // Create the payload object
        const payload = { userId: User.id, role: User.role };
        console.log('JWT Payload:', payload); // Log the payload to debug

        // Check if the payload is valid (should be an object)
        if (typeof payload !== 'object' || payload === null) {
            console.error('Invalid JWT payload:', payload);
            return NextResponse.json(
                { message: 'Invalid JWT payload' },
                { status: 500 }
            );
        }

        const signOptions: SignOptions = {
            //@ts-ignore
            expiresIn: process.env.JWT_EXPIRES_IN || '8h'
        };

        // Sign the JWT token
        const token = jwt.sign(payload, jwtSecret, signOptions);

        // Remove password from user data for response
        const { password: _, ...userWithoutPassword } = User;

        // Return response with user data and token
        return NextResponse.json({
            message: 'User created successfully',
            user: userWithoutPassword,
            token,
            patient: patient, // Return patient data only if patient was created
        }, { status: 201 });

    } catch (error) {
        // Log detailed error message for debugging
        console.error('Signup error:', error instanceof Error ? error.message : error);

        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
