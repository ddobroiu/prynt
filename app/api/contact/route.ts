import { NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Te rugăm să completezi câmpurile obligatorii.' },
        { status: 400 }
      );
    }

    // Trimitem emailul folosind funcția centralizată
    await sendContactFormEmail({ name, email, phone, message });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Eroare la trimiterea emailului:', error);
    
    // Mesaj de eroare detaliat pentru debugging
    const errorMessage = error?.message || 'Eroare internă server.';
    
    return NextResponse.json(
      { error: `Nu s-a putut trimite mesajul. Detalii: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}