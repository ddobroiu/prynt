import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import {
  calculateBannerPrice,
  calculateBannerVersoPrice,
  calculateFlyerPrice,
} from "@/lib/pricing";

type ToolContext = {
  source: 'whatsapp' | 'web';
  identifier: string; // telefon pentru whatsapp, email/session pentru web
};

export async function executeTool(fnName: string, args: any, context: ToolContext) {
  console.log(`🔧 Executare tool: ${fnName}`, args);
  
  try {
    // ============================================================
    // 1. CALCUL PREȚ BANNER
    // ============================================================
    if (fnName === "calculate_banner_price") {
      const hem = args.want_hem_and_grommets !== false;
      const mat = args.material?.includes("510") ? "frontlit_510" : "frontlit_440";

      if (args.type === "verso") {
        const res = calculateBannerVersoPrice({
          width_cm: args.width_cm,
          height_cm: args.height_cm,
          quantity: args.quantity,
          want_wind_holes: args.want_wind_holes || false,
          same_graphic: args.same_graphic ?? true,
          designOption: "upload",
        });
        return { pret_total: res.finalPrice, info: "Banner față-verso" };
      } else {
        const res = calculateBannerPrice({
          width_cm: args.width_cm,
          height_cm: args.height_cm,
          quantity: args.quantity,
          material: mat,
          want_wind_holes: args.want_wind_holes || false,
          want_hem_and_grommets: hem,
          designOption: "upload",
        });
        return {
          pret_total: res.finalPrice,
          info: `Banner ${mat}, ${hem ? "cu finisaje" : "fără finisaje"}`,
        };
      }
    }

    // ============================================================
    // 2. CALCUL PREȚ FLYER / PRINT STANDARD
    // ============================================================
    else if (fnName === "calculate_standard_print_price") {
      const res = calculateFlyerPrice({
        sizeKey: args.size || "A6",
        quantity: args.quantity,
        twoSided: args.two_sided ?? true,
        paperWeightKey: "135",
        designOption: "upload",
      });
      return { pret_total: res.finalPrice };
    }

    // ============================================================
    // 3. VERIFICARE STATUS COMANDĂ + LINK DPD
    // ============================================================
    else if (fnName === "check_order_status") {
      const orderNo = parseInt(args.orderNo);
      if (isNaN(orderNo)) {
        return { error: "Numărul comenzii trebuie să fie numeric." };
      }

      const order = await prisma.order.findUnique({
        where: { orderNo: orderNo },
        select: { status: true, awbNumber: true, awbCarrier: true }
      });

      if (!order) {
        return { found: false, message: "Comanda nu a fost găsită." };
      }

      let trackingInfo = "";
      let statusExplanation = "";

      // Link DPD
      if (order.awbNumber) {
        const trackingUrl = `https://tracking.dpd.ro/?shipmentNumber=${order.awbNumber}&language=ro`;
        trackingInfo = `AWB: ${order.awbNumber}. Puteți urmări coletul pe site-ul curierului aici: ${trackingUrl}`;
      } else {
        trackingInfo = "Încă nu a fost generat un AWB.";
      }

      // Explicație status (Important: Să nu creadă clientul că e livrat dacă e doar 'completed')
      if (order.status === 'completed' || order.status === 'shipped') {
        statusExplanation = "Statusul nostru 'Finalizat' înseamnă că am finalizat producția și am predat coletul curierului. Nu înseamnă că a fost livrat la dvs. Pentru locația exactă a coletului, vă rugăm să verificați link-ul de tracking de mai sus.";
      } else {
        statusExplanation = "Comanda este în curs de pregătire la noi în atelier.";
      }

      return {
        found: true,
        status: order.status,
        message: `Status intern Prynt: ${order.status}.\n${statusExplanation}\n\n${trackingInfo}`
      };
    }

    // ============================================================
    // 4. GENERARE OFERTĂ PDF (CU NUME CLIENT)
    // ============================================================
    else if (fnName === "generate_offer") {
      const { customer_details, items } = args;
      const totalAmount = items.reduce(
        (acc: number, item: any) => acc + (item.price * item.quantity), 0
      );

      // Identificăm userul (dacă există)
      let existingUser = null;
      if (customer_details.email) {
          existingUser = await prisma.user.findFirst({
              where: { email: customer_details.email }
          });
      }

      // Determinăm următorul ID de comandă (folosit și la oferte pentru consistență)
      const lastOrder = await prisma.order.findFirst({ orderBy: { orderNo: 'desc' } });
      const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1; 

      // Creăm o înregistrare de tip "Ofertă"
      const offerData: any = {
        orderNo: nextOrderNo, // Folosim secvența, dar marcat ca ofertă
        status: "pending_verification",
        paymentStatus: "pending",
        paymentMethod: "oferta",
        paymentType: "Card",
        currency: "RON",
        total: totalAmount,
        userEmail: customer_details.email || `offer_${context.source}@prynt.ro`,
        shippingAddress: {
          name: customer_details.name, // Salvăm numele aici
          phone: customer_details.phone || "-",
          street: customer_details.address || "-",
          city: customer_details.city || "-",
          county: customer_details.county || "-",
          country: "Romania",
        },
        billingAddress: {
          name: customer_details.name, // Salvăm numele și aici
          phone: customer_details.phone || "-",
          street: customer_details.address || "-",
          city: customer_details.city || "-",
          county: customer_details.county || "-",
          country: "Romania",
        },
        items: {
          create: items.map((item: any) => ({
            name: item.title,
            qty: Number(item.quantity) || 1,
            unit: Number(item.price) || 0,
            total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
            artworkUrl: null,
            metadata: {
              details: item.details,
              source: `AI Offer (${context.source})`,
            },
          })),
        },
        metadata: { 
            type: 'offer', // Marcaj critic pentru a distinge de comenzi reale
            generatedFrom: context.source,
            clientName: customer_details.name // ADĂUGAT: Salvăm numele explicit și în metadata
        }
      };

      if (existingUser) {
        offerData.user = { connect: { id: existingUser.id } };
      }

      const offerRecord = await prisma.order.create({ data: offerData });

      // Generăm link-ul public către PDF
      const baseUrl = process.env.NEXTAUTH_URL || "https://prynt.ro";
      // Ruta /api/pdf/offer va folosi ID-ul pentru a prelua datele din DB (inclusiv numele clientului)
      const offerLink = `${baseUrl}/api/pdf/offer?id=${offerRecord.id}`;

      return { 
          success: true, 
          link: offerLink, 
          message: `Am generat oferta de preț (Proformă) pentru ${customer_details.name}.\n\n📄 Descarcă oferta de aici: ${offerLink}\n\nDacă totul este în regulă, confirmă și putem transforma oferta în comandă fermă!` 
      };
    }

    // ============================================================
    // 5. CREARE COMANDĂ FERMĂ
    // ============================================================
    else if (fnName === "create_order") {
      const { customer_details, items } = args;
      const totalAmount = items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity, 0
      );

      const lastOrder = await prisma.order.findFirst({
        orderBy: { orderNo: "desc" },
        select: { orderNo: true },
      });
      const nextOrderNo = (lastOrder?.orderNo ?? 1000) + 1;

      // Identificăm userul
      let existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: customer_details.email },
            { phone: customer_details.phone },
          ],
        },
      });

      // Email fallback
      const userEmail = customer_details.email || (context.source === 'whatsapp' ? `whatsapp_${context.identifier}@prynt.ro` : `guest_${nextOrderNo}@prynt.ro`);
      const userPhone = customer_details.phone || context.identifier;

      const orderData: any = {
        orderNo: nextOrderNo,
        status: "pending_verification",
        paymentStatus: "pending",
        paymentMethod: "ramburs",
        currency: "RON",
        total: totalAmount,
        userEmail: userEmail,
        shippingAddress: {
          name: customer_details.name,
          phone: userPhone,
          street: customer_details.address,
          city: customer_details.city,
          county: customer_details.county,
          country: "Romania",
        },
        billingAddress: {
          name: customer_details.name,
          phone: userPhone,
          street: customer_details.address,
          city: customer_details.city,
          county: customer_details.county,
          country: "Romania",
        },
        items: {
          create: items.map((item: any) => ({
            name: item.title,
            qty: Number(item.quantity) || 1,
            unit: Number(item.price) || 0,
            total: (Number(item.price) || 0) * (Number(item.quantity) || 1),
            artworkUrl: null,
            metadata: {
              details: item.details,
              source: context.source === 'whatsapp' ? "WhatsApp Assistant" : "Web Assistant",
            },
          })),
        },
      };

      if (existingUser) {
        orderData.user = { connect: { id: existingUser.id } };
      }

      const order = await prisma.order.create({ data: orderData });

      // Emailuri de confirmare
      try {
        if (order && typeof sendOrderConfirmationEmail === "function") await sendOrderConfirmationEmail(order);
        if (order && typeof sendNewOrderAdminEmail === "function") await sendNewOrderAdminEmail(order);
      } catch (e) {
        console.error("Email fail", e);
      }

      return { success: true, orderId: order.id, orderNo: order.orderNo };
    }

    // Fallback pentru alte tools neimplementate complet
    return { info: "Funcție neimplementată complet sau necunoscută." };

  } catch (e: any) {
    console.error("Tool Execution Error:", e);
    return { error: e.message ?? "Eroare necunoscută în tool." };
  }
}