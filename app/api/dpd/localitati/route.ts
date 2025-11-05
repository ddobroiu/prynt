import { NextRequest, NextResponse } from 'next/server';

// URL-ul către documentația WSDL a DPD.
const wsdlUrl = 'https://api.dpd.ro/v1/services?wsdl';

export async function GET(req: NextRequest) {
    
    console.log(`--- TEST DIAGNOSTIC DPD WSDL ---`);
    console.log(`Se încearcă descărcarea fișierului de la: ${wsdlUrl}`);

    try {
        const response = await fetch(wsdlUrl);
        const responseText = await response.text();

        console.log(`Status code primit: ${response.status}`);
        console.log('--- CONȚINUT BRUT PRIMIT DE LA DPD WSDL URL ---');
        console.log(responseText);
        console.log('-------------------------------------------');

        if (!response.ok) {
            throw new Error(`Serverul DPD a răspuns cu status ${response.status}`);
        }

        // Verificăm dacă răspunsul pare a fi XML
        if (responseText.trim().startsWith('<?xml') || responseText.trim().startsWith('<')) {
            return NextResponse.json({
                status: 'SUCCES_PARTIAL',
                message: 'Fișierul a fost descărcat și pare a fi XML. Problema ar putea fi în conținutul său.',
                content: responseText.substring(0, 1000) + '...', // Afișăm doar primele 1000 de caractere
            });
        } else {
             throw new Error(`Fișierul descărcat nu pare a fi XML. Este posibil să fie o pagină de eroare HTML sau JSON.`);
        }

    } catch (error: any) {
        console.error('[DIAGNOSTIC DPD] - EROARE:', error.message);
        return NextResponse.json({
            status: 'EROARE_CRITICA',
            message: error.message,
        }, { status: 500 });
    }
}