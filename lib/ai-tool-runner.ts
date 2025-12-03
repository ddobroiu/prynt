import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import {
  calculateBannerPrice,
  calculateBannerVersoPrice,
  calculateFlyerPrice,
  calculateWindowGraphicsPrice,
  calculateRollupPrice,
  calculateCanvasPrice,
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
    // 3. CALCUL PREȚ WINDOW GRAPHICS
    // ============================================================
    else if (fnName === "calculate_window_graphics_price") {
      const res = calculateWindowGraphicsPrice({
        width_cm: args.width_cm,
        height_cm: args.height_cm,
        quantity: args.quantity,
        designOption: args.design_pro ? "pro" : "upload",
      });
      return { 
        pret_total: res.finalPrice, 
        pret_unitar: res.pricePerSqm,
        suprafata_mp: res.total_sqm,
        info: `Window Graphics folie PVC 140μ perforată (${res.total_sqm.toFixed(2)} mp × ${res.pricePerSqm} lei/mp)${args.design_pro ? ' + Design Pro 100 lei' : ''}`
      };
    }

    // ============================================================
    // 4. CALCUL PREȚ CANVAS
    // ============================================================
    else if (fnName === "calculate_roll_print_price" && args.product_type === "canvas") {
      // Determinăm frameType și framedSize din args
      let frameType: "framed" | "none" = "none";
      let framedSize: string | undefined = undefined;
      let framedShape: "rectangle" | "square" = "rectangle";

      // Dacă args conține framed_size, înseamnă că e Cu Ramă
      if (args.framed_size) {
        frameType = "framed";
        framedSize = args.framed_size;
        // Detectăm forma din dimensiune (ex: "30x30" = square)
        if (framedSize) {
          const parts = framedSize.split("x");
          if (parts.length === 2) {
            const [w, h] = parts.map(Number);
            framedShape = w === h ? "square" : "rectangle";
          }
        }
      }

      const res = calculateCanvasPrice({
        width_cm: args.width_cm || 0,
        height_cm: args.height_cm || 0,
        quantity: args.quantity,
        edge_type: "mirror", // fix oglindită
        designOption: args.design_pro ? "pro" : "upload",
        frameType: frameType,
        framedSize: framedSize,
        framedShape: framedShape,
      });

      const typeInfo = frameType === "framed" 
        ? `Canvas cu Ramă ${framedSize?.replace("x", "×")} cm`
        : `Canvas ${args.width_cm}×${args.height_cm} cm`;

      return { 
        pret_total: res.finalPrice,
        pret_unitar: Math.round((res.finalPrice / args.quantity) * 100) / 100,
        info: `${typeInfo} (margine oglindită, include șasiu)${args.design_pro ? ' + Design Pro 40 lei' : ''}`
      };
    }

    // ============================================================
    // 5. CALCUL PREȚ ROLLUP BANNER
    // ============================================================
    else if (fnName === "calculate_rollup_price") {
      const res = calculateRollupPrice({
        width: args.width_cm,
        quantity: args.quantity,
        designOption: args.design_pro ? "pro" : "upload",
      });
      return { 
        pret_total: res.finalPrice, 
        pret_unitar: res.unitPrice,
        info: `Rollup ${args.width_cm}cm × 200cm (${args.quantity} buc × ${res.unitPrice} lei/buc)${args.design_pro ? ' + Design Pro 100 lei' : ''}. Include: casetă aluminiu + print Blueback 440g + geantă transport`
      };
    }

    // ============================================================
    // 5. VERIFICARE STATUS COMANDĂ + LINK DPD
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
    // 6. GENERARE OFERTĂ PDF (CU NUME CLIENT)
    // ============================================================
    else if (fnName === "generate_offer") {
      console.log("📄 generate_offer called with args:", JSON.stringify(args, null, 2));
      
      const { customer_details, items } = args;
      
      // Validări
      if (!customer_details || !customer_details.name) {
        console.error("❌ generate_offer: Lipsește customer_details.name!");
        return { 
          success: false, 
          error: "Numele clientului este obligatoriu pentru generarea ofertei." 
        };
      }
      
      if (!items || !Array.isArray(items) || items.length === 0) {
        console.error("❌ generate_offer: Items array gol sau invalid!");
        return { 
          success: false, 
          error: "Lista de produse este obligatorie pentru generarea ofertei." 
        };
      }
      
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
      // Structură adresă pentru câmpurile JSON (address & billing)
      const addressData = {
        name: customer_details.name,
        email: customer_details.email || `offer_${context.source}@prynt.ro`,
        phone: customer_details.phone || "",
        street: customer_details.address || "",
        city: customer_details.city || "",
        county: customer_details.county || "",
        country: "Romania",
      };

      // Marketing metadata pentru a stoca informații suplimentare
      const marketingData = {
        type: 'offer',
        generatedFrom: context.source,
        clientName: customer_details.name,
        paymentMethod: "oferta",
        currency: "RON",
        items: items.map((item: any) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          details: item.details,
        })),
      };

      const offerData: any = {
        orderNo: nextOrderNo,
        status: "pending_verification",
        paymentType: "Ramburs", // Ramburs pentru oferte
        total: totalAmount,
        shippingFee: 0,
        address: addressData,
        billing: addressData,
        marketing: marketingData,
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
      };

      if (existingUser) {
        offerData.user = { connect: { id: existingUser.id } };
      }

      const offerRecord = await prisma.order.create({ data: offerData });

      // Generăm link-ul public către PDF
      const baseUrl = process.env.NEXTAUTH_URL || "https://prynt.ro";
      // Ruta /api/pdf/offer va folosi ID-ul pentru a prelua datele din DB (inclusiv numele clientului)
      const offerLink = `${baseUrl}/api/pdf/offer?id=${offerRecord.id}`;

      console.log("✅ Ofertă creată cu ID:", offerRecord.id);

      return { 
          success: true, 
          orderNo: nextOrderNo,
          link: offerLink,
          customerName: customer_details.name,
          total: totalAmount,
          message: `Oferta PDF a fost generată cu succes pentru ${customer_details.name}!\n\n📄 **Link descărcare:** ${offerLink}\n\n**Detalii ofertă:**\n- Număr ofertă: #${nextOrderNo}\n- Total: ${totalAmount.toFixed(2)} RON\n- Validitate: 30 zile\n- Format: PDF profesional cu logo Prynt.ro\n\nOferta conține toate detaliile produselor discutate. Dacă totul este în regulă, putem transforma oferta în comandă fermă!` 
      };
    }

    // ============================================================
    // 7. CREARE COMANDĂ FERMĂ
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