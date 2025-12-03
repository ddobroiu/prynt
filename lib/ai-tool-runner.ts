import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendNewOrderAdminEmail } from "@/lib/email";
import {
  calculateBannerPrice,
  calculateBannerVersoPrice,
  calculateFlyerPrice,
  calculateWindowGraphicsPrice,
  calculateRollupPrice,
  calculateCanvasPrice,
  calculateTapetPrice,
  calculateAutocolantePrice,
  calculatePosterPrice,
  calculatePliantePrice,
  calculatePlexiglassPrice,
  calculatePVCForexPrice,
  calculateAlucobondPrice,
  calculatePolipropilenaPrice,
  calculateCartonPrice,
  calculateFonduriEUPrice,
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
    // 2. CALCUL PREȚ FLYER / AFIȘE / PLIANTE
    // ============================================================
    else if (fnName === "calculate_standard_print_price") {
      // Verificăm tipul de produs
      if (args.product_type === "afis") {
        const res = calculatePosterPrice({
          sizeKey: args.size || "A3",
          quantity: args.quantity,
          paperKey: args.paper_type || "blueback",
          designOption: "upload",
        });
        return { 
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          info: `Afișe ${args.size} pe ${args.paper_type || 'Blueback'}`
        };
      } else if (args.product_type === "pliant") {
        const res = calculatePliantePrice({
          sizeKey: args.size || "A5",
          quantity: args.quantity,
          paperKey: args.paper_type || "130",
          foldType: args.fold_type || "2",
          designOption: "upload",
        });
        return { 
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          info: `Pliante ${args.size} ${args.fold_type || '2'} falduri pe hârtie ${args.paper_type || '130g'}`
        };
      } else {
        // Flyer implicit
        const res = calculateFlyerPrice({
          sizeKey: args.size || "A6",
          quantity: args.quantity,
          twoSided: args.two_sided ?? true,
          paperWeightKey: "135",
          designOption: "upload",
        });
        return { 
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          info: `Flyere ${args.size} ${args.two_sided ? 'față-verso' : 'o față'}`
        };
      }
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
    // 4.5. CALCUL PREȚ TAPET
    // ============================================================
    else if (fnName === "calculate_roll_print_price" && args.product_type === "tapet") {
      const res = calculateTapetPrice({
        width_cm: args.width_cm || 0,
        height_cm: args.height_cm || 0,
        quantity: args.quantity,
        want_adhesive: args.options?.adhesive || false,
        designOption: args.design_pro ? "pro" : "upload",
      });

      return { 
        pret_total: res.finalPrice,
        pret_unitar: res.pricePerUnit,
        suprafata_mp: res.totalSqm || res.total_sqm || 0,
        info: `Tapet ${args.width_cm}×${args.height_cm} cm (${(res.totalSqm || res.total_sqm || 0).toFixed(2)} mp total)${args.options?.adhesive ? ' + Adeziv auto-adeziv (+10%)' : ''}${args.design_pro ? ' + Design Pro 200 lei' : ''}`
      };
    }

    // ============================================================
    // 4.6. CALCUL PREȚ AUTOCOLANTE
    // ============================================================
    else if (fnName === "calculate_roll_print_price" && args.product_type === "autocolant") {
      const res = calculateAutocolantePrice({
        width_cm: args.width_cm || 0,
        height_cm: args.height_cm || 0,
        quantity: args.quantity,
        materialKey: args.material_subtype || "oracal_651",
        printType: args.options?.diecut === false ? "print_only" : "print_cut",
        laminated: args.options?.laminated || false,
        designOption: args.design_pro ? "pro" : "upload",
      });

      return { 
        pret_total: res.finalPrice,
        pret_unitar: res.pricePerUnit,
        suprafata_mp: res.total_sqm || 0,
        info: `Autocolante ${args.width_cm}×${args.height_cm} cm (${(res.total_sqm || 0).toFixed(2)} mp) pe ${args.material_subtype || 'Oracal 651'}${args.options?.laminated ? ' + Laminare' : ''}${args.options?.diecut === false ? ' Print Only' : ' Print+Cut'}${args.design_pro ? ' + Design Pro 30 lei' : ''}`
      };
    }

    // ============================================================
    // 4.7. CALCUL PREȚ MATERIALE RIGIDE
    // ============================================================
    else if (fnName === "calculate_rigid_price") {
      const { material_type, width_cm, height_cm, quantity, thickness_mm, print_double, color, subtype } = args;

      if (material_type === "plexiglass") {
        const res = calculatePlexiglassPrice({
          width_cm: width_cm || 0,
          height_cm: height_cm || 0,
          quantity: quantity || 1,
          thickness: thickness_mm || 3,
          printType: print_double ? "both" : subtype === "transparent" ? "front" : "white",
          designOption: args.design_pro ? "pro" : "upload",
        });
        return {
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          suprafata_mp: res.total_sqm || 0,
          info: `Plexiglas ${subtype || 'alb'} ${thickness_mm}mm (${(res.total_sqm || 0).toFixed(2)} mp)${print_double ? ' print față-verso' : ''}${args.design_pro ? ' + Design Pro 60 lei' : ''}`
        };
      } else if (material_type === "forex") {
        const res = calculatePVCForexPrice({
          width_cm: width_cm || 0,
          height_cm: height_cm || 0,
          quantity: quantity || 1,
          thickness: thickness_mm || 3,
          designOption: args.design_pro ? "pro" : "upload",
        });
        return {
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          suprafata_mp: res.total_sqm || 0,
          info: `PVC Forex ${thickness_mm}mm (${(res.total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 50 lei' : ''}`
        };
      } else if (material_type === "alucobond") {
        const res = calculateAlucobondPrice({
          width_cm: width_cm || 0,
          height_cm: height_cm || 0,
          quantity: quantity || 1,
          thickness: thickness_mm || 3,
          color: color || "alb",
          designOption: args.design_pro ? "pro" : "upload",
        });
        return {
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          suprafata_mp: res.total_sqm || 0,
          info: `Alucobond ${thickness_mm}mm culoare ${color || 'alb'} (${(res.total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 60 lei' : ''}`
        };
      } else if (material_type === "polipropilena") {
        const res = calculatePolipropilenaPrice({
          width_cm: width_cm || 0,
          height_cm: height_cm || 0,
          quantity: quantity || 1,
          thickness: thickness_mm || 3,
          designOption: args.design_pro ? "pro" : "upload",
        });
        return {
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          suprafata_mp: res.total_sqm || 0,
          info: `Polipropilenă ${thickness_mm}mm (${(res.total_sqm || 0).toFixed(2)} mp)${args.design_pro ? ' + Design Pro 50 lei' : ''}`
        };
      } else if (material_type === "carton") {
        const res = calculateCartonPrice({
          width_cm: width_cm || 0,
          height_cm: height_cm || 0,
          quantity: quantity || 1,
          cartonType: subtype || "ondulat_E",
          printBothSides: print_double || false,
          designOption: args.design_pro ? "pro" : "upload",
        });
        return {
          pret_total: res.finalPrice,
          pret_unitar: res.pricePerUnit,
          suprafata_mp: res.total_sqm || 0,
          info: `Carton ${subtype || 'ondulat E'} (${(res.total_sqm || 0).toFixed(2)} mp)${print_double ? ' print față-verso' : ''}${args.design_pro ? ' + Design Pro 50 lei' : ''}`
        };
      }

      return { error: "Tip material rigid necunoscut" };
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
    // 5.5. CALCUL PREȚ FONDURI EU
    // ============================================================
    else if (fnName === "calculate_fonduri_eu_price") {
      // Construim obiectul selections pentru calculateFonduriEUPrice
      const selections: Record<string, string> = {
        comunicat: args.comunicat || "none",
        panouPrincipal: args.panou_principal_size || "none",
        materialPanouPrincipal: args.panou_principal_material || "alucobond",
        autocolanteLaterale: args.autocolante_size || "none",
        panouTemporar: args.panou_temporar || "none",
        placaPermanenta: args.placa_permanenta || "none",
      };

      // Adăugăm logo dacă e cazul
      if (args.add_logo) {
        selections.logo = "yes";
      }

      const res = calculateFonduriEUPrice({ selections });

      return {
        pret_total: res.finalPrice,
        info: `Kit Vizibilitate Fonduri ${args.funding_type?.toUpperCase() || 'UE'}: Panou ${args.panou_principal_size} pe ${args.panou_principal_material || 'Alucobond'}${args.autocolante_size && args.autocolante_size !== 'none' ? ` + Autocolante ${args.autocolante_size}` : ''}${args.add_logo ? ' + Logo' : ''}`
      };
    }

    // ============================================================
    // 6. VERIFICARE STATUS COMANDĂ + LINK DPD
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
    // 7. CĂUTARE CLIENȚI ÎN BAZA DE DATE
    // ============================================================
    else if (fnName === "search_customers") {
      const { partial_name } = args;
      
      if (!partial_name || partial_name.length < 2) {
        return { 
          success: false, 
          customers: [],
          message: "Numele trebuie să conțină minim 2 caractere pentru căutare." 
        };
      }

      try {
        // Căutăm în Order după numele din câmpul billing
        const orders = await prisma.order.findMany({
          where: {
            billing: {
              path: ['name'],
              string_contains: partial_name
            }
          },
          select: {
            billing: true
          },
          distinct: ['billing'],
          take: 5 // Limităm la 5 rezultate
        });

        // Extragem numele unice
        const uniqueNames = new Set<string>();
        orders.forEach(order => {
          const billing = order.billing as any;
          if (billing?.name) {
            uniqueNames.add(billing.name);
          }
        });

        const customers = Array.from(uniqueNames);

        if (customers.length > 0) {
          return {
            success: true,
            customers: customers,
            message: `Am găsit ${customers.length} clienți cu numele similar. Îți sugerez să confirmi: ${customers.join(', ')}`
          };
        } else {
          return {
            success: true,
            customers: [],
            message: "Nu am găsit clienți existenți cu acest nume în baza de date."
          };
        }
      } catch (error: any) {
        console.error("Eroare căutare clienți:", error);
        return {
          success: false,
          customers: [],
          message: "Eroare la căutarea în baza de date."
        };
      }
    }

    // ============================================================
    // 8. GENERARE OFERTĂ PDF (CU NUME CLIENT)
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
          message: `Oferta PDF a fost generată cu succes pentru ${customer_details.name}!\n\n**Detalii ofertă:**\n- Număr ofertă: #${nextOrderNo}\n- Total: ${totalAmount.toFixed(2)} RON\n- Validitate: 30 zile\n- Format: PDF profesional cu logo Prynt.ro\n\nOferta conține toate detaliile produselor discutate. Dacă totul este în regulă, putem transforma oferta în comandă fermă!\n\n||BUTTON:Descarcă Oferta PDF:${offerLink}||` 
      };
    }

    // ============================================================
    // 9. CREARE COMANDĂ FERMĂ
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