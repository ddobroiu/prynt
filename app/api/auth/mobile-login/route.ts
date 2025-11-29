import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// CORS headers for mobile app
function addCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}

export async function OPTIONS(req: NextRequest) {
  return addCORSHeaders(new NextResponse(null, { status: 200 }));
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      const response = NextResponse.json({ 
        success: false, 
        message: 'Email și parola sunt obligatorii' 
      }, { status: 400 });
      return addCORSHeaders(response);
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true
      }
    });

    if (!user || !user.passwordHash) {
      const response = NextResponse.json({ 
        success: false, 
        message: 'Email sau parolă incorectă' 
      }, { status: 401 });
      return addCORSHeaders(response);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      const response = NextResponse.json({ 
        success: false, 
        message: 'Email sau parolă incorectă' 
      }, { status: 401 });
      return addCORSHeaders(response);
    }

    // Generate JWT token
    const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    if (!secret) {
      console.error('JWT secret not configured');
      const response = NextResponse.json({ 
        success: false, 
        message: 'Configurare server invalidă' 
      }, { status: 500 });
      return addCORSHeaders(response);
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      secret,
      { expiresIn: '7d' } // Token valid for 7 days
    );

    // Return success with token and user data
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
    return addCORSHeaders(response);

  } catch (error) {
    console.error('Mobile login error:', error);
    const response = NextResponse.json({ 
      success: false, 
      message: 'Eroare internă' 
    }, { status: 500 });
    return addCORSHeaders(response);
  }
}