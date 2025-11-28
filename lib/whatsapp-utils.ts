// lib/whatsapp-utils.ts
const WHATSAPP_API_URL = `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

/**
 * Trimite un mesaj text simplu pe WhatsApp
 */
export async function sendWhatsAppMessage(to: string, body: string) {
  const payload = {
    messaging_product: 'whatsapp',
    to: to,
    text: { body: body },
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
      console.error('Error sending WhatsApp message:', JSON.stringify(errorData, null, 2));
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
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
  // Formatăm butoanele conform cerințelor API-ului WhatsApp
  const formattedButtons = buttons.map((btn) => ({
    type: 'reply',
    reply: {
      id: btn.id,
      title: btn.title,
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
        buttons: formattedButtons,
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
      console.error('Error sending interactive button message:', JSON.stringify(errorData, null, 2));
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error sending interactive button message:', error);
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