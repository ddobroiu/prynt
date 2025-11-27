const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

/**
 * Trimite mesaj pe WhatsApp. Dacă options este definit, trimite Quick Replies.
 */
export async function sendWhatsAppMessage(to: string, text: string, options?: { id: string, title: string }[]) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error("WHATSAPP_TOKEN sau PHONE_NUMBER_ID lipsă din .env");
    return;
  }

  let payload: any = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: to,
  };

  if (options && options.length > 0) {
    payload.type = "interactive";
    payload.interactive = {
      type: "button",
      body: { text },
      action: {
        buttons: options.map(opt => ({
          type: "reply",
          reply: { id: opt.id, title: opt.title }
        }))
      }
    };
  } else {
    payload.type = "text";
    // preview_url: true pentru ca link-urile (ex: DPD) să aibă preview
    payload.text = { preview_url: true, body: text };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (!res.ok) console.error("WhatsApp Send Error:", data);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}