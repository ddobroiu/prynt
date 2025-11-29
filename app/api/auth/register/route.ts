import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '@/lib/email'; // <--- Importăm funcția nouă

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
    const { email, password, name } = await req.json();

    if (!email || typeof email !== 'string') {
      const response = NextResponse.json({ success: false, message: 'Email invalid.' }, { status: 400 });
      return addCORSHeaders(response);
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      const response = NextResponse.json({ success: false, message: 'Parola trebuie să aibă minim 8 caractere.' }, { status: 400 });
      return addCORSHeaders(response);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      const response = NextResponse.json({ success: false, message: 'Există deja un cont cu acest email.' }, { status: 409 });
      return addCORSHeaders(response);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        name: (typeof name === 'string' && name.trim()) ? name.trim() : undefined,
        passwordHash, // Atenție: schema ta folosește 'passwordHash' sau 'password'? Verifică schema.prisma.
                      // În codul anterior era 'password', aici văd 'passwordHash'. Adaptează după baza ta de date.
      },
    });

    // --- AICI AM ȘTERS BLOCUL VECHI ȘI AM PUS FUNCȚIA NOUĂ ---
    // Trimitem emailul modern prin Resend (definit în lib/email.ts)
    await sendWelcomeEmail(user.email!, user.name || "Client"); 
    // ---------------------------------------------------------

    const response = NextResponse.json({ success: true });
    return addCORSHeaders(response);

  } catch (e: any) {
    console.error('[register] error', e?.message || e);
    const response = NextResponse.json({ success: false, message: 'Eroare internă.' }, { status: 500 });
    return addCORSHeaders(response);
  }
}