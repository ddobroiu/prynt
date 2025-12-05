const WHATSAPP_API_VERSION = process.env.WHATSAPP_API_VERSION || 'v24.0';
const WHATSAPP_API_URL = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Trimite un mesaj text simplu pe WhatsApp
 */
export async function sendWhatsAppMessage(to: string, body: string) {
  if (!WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.error("❌ EROARE: Lipsesc variabilele de mediu WHATSAPP_ACCESS_TOKEN sau WHATSAPP_PHONE_NUMBER_ID");
    return null;
  }

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    text: { body: body },
  };

  try {
    console.log(`📤 Trimit mesaj WhatsApp către ${to}: ${body.substring(0, 50)}...`);
    const res = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ WhatsApp API Error (Text):', JSON.stringify(errorData, null, 2));
      console.error('❌ Status:', res.status, res.statusText);
      return null;
    }

    const result = await res.json();
    console.log(`✅ Mesaj WhatsApp trimis cu succes către ${to}`);
    return result;
  } catch (error) {
    console.error('❌ Network Error sending WhatsApp message:', error);
    return null;
  }
}

/**
 * Trimite un mesaj interactiv cu butoane (ex: Da/Nu)
 * @param to Numărul de telefon al destinatarului
 * @param text Textul mesajului (întrebarea)
 * @param buttons Lista de butoane (max 3). Fiecare buton are un id și un titlu (max 20 caractere)
 */
export async function sendInteractiveButtons(
  to: string, 
  text: string, 
  buttons: { id: string; title: string }[]
) {
  if (!WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    console.error("❌ EROARE: Lipsesc variabilele de mediu WHATSAPP_...");
    return null;
  }

  // VALIDARE: WhatsApp acceptă maxim 3 butoane și titluri de max 20 caractere
  const validButtons = buttons.slice(0, 3).map((btn) => ({
    type: 'reply',
    reply: {
      id: btn.id,
      // Tăiem titlul la 20 caractere pentru a evita eroarea API
      title: btn.title.length > 20 ? btn.title.substring(0, 17) + "..." : btn.title,
    },
  }));

  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: text,
      },
      action: {
        buttons: validButtons,
      },
    },
  };

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('❌ WhatsApp API Error (Buttons):', JSON.stringify(errorData, null, 2));
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('❌ Network Error sending button message:', error);
    return null;
  }
}

/**
 * Funcție helper pentru a trimite rapid butoane de Da/Nu
 */
export async function sendYesNoQuestion(to: string, questionText: string) {
  return sendInteractiveButtons(to, questionText, [
    { id: 'yes', title: 'Da' },
    { id: 'no', title: 'Nu' },
  ]);
}