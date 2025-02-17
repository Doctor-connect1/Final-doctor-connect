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
        const { firstName, lastName, email, password, role, phone, medicalHistory, dateOfBirth, gender, profilePicture, bio, username } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists (email only)
        const existingUser = await prisma.user.findFirst({
            where: { email }
        });
        console.log('existingUser:', existingUser);
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists with this email' },
                { status: 400 }
            );
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure the date is in the correct format (ISO-8601)
        const formattedDateOfBirth = new Date(dateOfBirth);
        if (isNaN(formattedDateOfBirth.getTime())) {
            return NextResponse.json(
                { message: 'Invalid date format for dateOfBirth' },
                { status: 400 }
            );
        }

        // Create the user
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role,
                bio,
            },
        });

        // Log the User object to verify the properties
        console.log('Created User:', user);

        // Ensure User.id and User.role are valid before signing JWT
        if (!user || !user.id) {
            console.error('Error: User id or role is missing. User:', user);
            return NextResponse.json(
                { message: 'User ID or role is missing' },
                { status: 500 }
            );
        }
        // Create patient record
        if (role === "Patient") {
            await prisma.patient.create({
                data: {
                    userId: user.id,
                    medicalHistory,
                    dateOfBirth: formattedDateOfBirth,
                    gender,
                    phone,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    email,
                    bio,
                    profilePicture
                },
            });
        } else {
            return NextResponse.json(
                { message: 'Invalid role specified' },
                { status: 400 }
            );
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
        const payload = { userId: user.id, role: role || "Patient" }; // Use actual role if passed or default to "Patient"
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

        // Return response with user data and token
        return NextResponse.json({
            message: 'User created successfully',
            user,
            token,
            role, // Return user data only if user was created
        }, { status: 201 });

    } catch (error) {
        // throw error;
        // Log detailed error message for debugging
        console.error('Signup error:', error instanceof Error ? error.message : error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}