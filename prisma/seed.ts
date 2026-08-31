import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Admin
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Criss2026!", salt);

  const admin = await prisma.admin.upsert({
    where: { email: "admin@crissresidence.ro" },
    update: {
      passwordHash,
      name: "Administrator Criss Residence",
    },
    create: {
      email: "admin@crissresidence.ro",
      name: "Administrator Criss Residence",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin seeded:", admin.email);

  // 2. Clear old properties & appointments for clean seed
  await prisma.propertyImage.deleteMany({});
  await prisma.appointmentStatusHistory.deleteMany({});
  await prisma.appointmentNote.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.availableTimeSlot.deleteMany({});

  // 3. Settings
  const defaultSettings = [
    { key: "company_name", value: "Criss Residence" },
    { key: "company_phone", value: "0740 123 456" },
    { key: "company_email", value: "contact@crissresidence.ro" },
    { key: "company_address", value: "Hereclean 35/A, DC12, Hereclean, Sălaj" },
    { key: "working_days", value: "Luni - Sâmbătă: 09:00 - 18:00" },
    { key: "appointment_duration", value: "45 minute" },
    { key: "instagram_url", value: "https://instagram.com" },
    { key: "facebook_url", value: "https://facebook.com" },
  ];

  for (const s of defaultSettings) {
    await prisma.setting.create({ data: s });
  }

  // 4. Available Time Slots (Mon=1 to Sat=6)
  const standardHours = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  for (let day = 1; day <= 6; day++) {
    for (const time of standardHours) {
      await prisma.availableTimeSlot.create({
        data: { dayOfWeek: day, time, isActive: true },
      });
    }
  }

  // 5. Four Demo Properties
  const prop1 = await prisma.property.create({
    data: {
      slug: "casa-la-proiect",
      title: "Casă la Proiect — Concept Minimalist",
      description:
        "Oportunitate exclusivistă de achiziție în faza de proiect. Vila oferă o arhitectură contemporană cu linii curate, suprafețe vitrate mari orientate spre sud și o compartimentare optimizată pentru confortul unei familii moderne. Achiziția în faza de proiect vă oferă flexibilitate totală în personalizarea compartimentărilor interioare și a gamei de finisaje.",
      price: 79900,
      priceType: "de_la",
      priceSuffix: "€",
      status: "În proiect",
      propertyType: "CASĂ LA PROIECT",
      bedrooms: 3,
      bathrooms: 2,
      rooms: 4,
      usableArea: 118,
      builtArea: 145,
      landArea: 500,
      floors: "Parter + Mansardă",
      parking: "2 locuri",
      utilities: "Apă curentă, Canalizare, Curent electric, Gaz la limita proprietății",
      constructionStage: "Faza de Proiectare & Autorizare",
      completionDate: "Trimestrul IV 2026",
      address: "Strada Principală, Hereclean, Sălaj",
      latitude: 47.2355,
      longitude: 23.0142,
      featured: true,
      order: 1,
      facilities: JSON.stringify([
        "Curte proprie 500 m²",
        "Încălzire în pardoseală",
        "Geamuri termoizolante tripan",
        "Izolație exterioară premium 15 cm",
        "Acces facil din drum asfaltat",
        "Zonă rezidențială liniștită",
        "Personalizare finisaje la cerere",
        "Termen garantat prin contract",
      ]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85",
            caption: "Vedere exterioară fațadă principală",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
            caption: "Perspectivă laterală și curte",
            isPrimary: false,
            order: 2,
          },
          {
            url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=85",
            caption: "Randare zonă de living open space",
            isPrimary: false,
            order: 3,
          },
          {
            url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1600&q=85",
            caption: "Zonă dining și bucătărie",
            isPrimary: false,
            order: 4,
          },
        ],
      },
    },
  });

  const prop2 = await prisma.property.create({
    data: {
      slug: "casa-la-rosu",
      title: "Casă la Roșu — Structură Solidă & Eficiență",
      description:
        "Locuință individuală ridicată la roșu, cu structură de rezistență din beton armat și zidărie din cărămidă termoizolantă de înaltă densitate. Acoperișul este complet montat cu tablă fălțuită antracit de calitate superioară. Imobilul este ideal pentru cumpărătorii care doresc să își configureze independent instalațiile și finisajele interioare.",
      price: 99900,
      priceType: "de_la",
      priceSuffix: "€",
      status: "Disponibilă",
      propertyType: "CASĂ LA ROȘU",
      bedrooms: 3,
      bathrooms: 2,
      rooms: 4,
      usableArea: 135,
      builtArea: 168,
      landArea: 550,
      floors: "Parter + Etaj",
      parking: "2 locuri exterioare amenajabile",
      utilities: "Branșamente apă și curent realizate, gaz la poartă",
      constructionStage: "Structură ridicată, acoperiș finalizat",
      completionDate: "Disponibilă imediat pentru finisare",
      address: "Hereclean 35/A, DC12, Hereclean, Sălaj",
      latitude: 47.2341,
      longitude: 23.0125,
      featured: true,
      order: 2,
      facilities: JSON.stringify([
        "Teren generos 550 m²",
        "Structură beton armat certificată",
        "Zidărie cărămidă Porotherm 30cm",
        "Acoperiș finisat tablă antracit",
        "Branșamente utilități la parcelă",
        "Acces direct din drum asfaltat DC12",
        "Plan arhitectural avizat",
        "Orientare cardinală optimă",
      ]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=85",
            caption: "Fațadă modernă și volumetrie",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
            caption: "Vedere curte și terasă",
            isPrimary: false,
            order: 2,
          },
          {
            url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=85",
            caption: "Deschidere spre grădină",
            isPrimary: false,
            order: 3,
          },
        ],
      },
    },
  });

  const prop3 = await prisma.property.create({
    data: {
      slug: "casa-semifinisata-la-cheie",
      title: "Casă Semifinisată / La Cheie — Vila Elegance",
      description:
        "Proprietate de excepție gata de primire sau la stadiul de semifinisat avansat, conform preferințelor dumneavoastră. Dispune de încălzire în pardoseală pe ambele niveluri, tâmplărie PVC Salamander 6 camere cu sticlă tripan tratată solar, instalații sanitare și electrice executate cu aparataj modular, șape turnate mecanizat și pereți gletuiți pregătiți de zugrăveală. Curtea este perimetral împrejmuită și nivelată.",
      price: 139900,
      priceType: "de_la",
      priceSuffix: "€",
      status: "Disponibilă",
      propertyType: "CASĂ LA CHEIE",
      bedrooms: 3,
      bathrooms: 3,
      rooms: 5,
      usableArea: 145,
      builtArea: 180,
      landArea: 600,
      floors: "Parter + Etaj",
      parking: "2 locuri amenajate (pavele)",
      utilities: "Toate utilitățile racordate și funcționale",
      constructionStage: "Semifinisat avansat / La cheie la cerere",
      completionDate: "Disponibilă imediat",
      address: "Hereclean 35/A, DC12, Hereclean, Sălaj",
      latitude: 47.2348,
      longitude: 23.0131,
      featured: true,
      order: 3,
      facilities: JSON.stringify([
        "Curte privată 600 m²",
        "Încălzire în pardoseală cu reglaj pe zone",
        "Tâmplărie Salamander 6 camere tripan",
        "Instalații electrice și sanitare premium",
        "Izolație termică vată bazaltică 15cm",
        "Curte amenajată și poartă acces",
        "Locuri de parcare pavate",
        "Zonă exclusivistă de case noi",
      ]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
            caption: "Fațadă principală iluminată arhitectural",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85",
            caption: "Living room generos cu ferestre mari",
            isPrimary: false,
            order: 2,
          },
          {
            url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85",
            caption: "Bucătărie cu insulă și spațiu de dining",
            isPrimary: false,
            order: 3,
          },
          {
            url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=85",
            caption: "Dormitor matrimonial cu baie proprie",
            isPrimary: false,
            order: 4,
          },
        ],
      },
    },
  });

  const prop4 = await prisma.property.create({
    data: {
      slug: "parcela-teren-casa",
      title: "Parcelă Teren pentru Casă — Hereclean Hills",
      description:
        "Parcelă rezidențială individuală cu panoramă spectaculoasă și orientare sudică ideală pentru construirea casei de vis. Terenul este situat într-o zonă liniștită de case unifamiliale, cu acces facil la drumul comunal asfaltat DC12. Rețelele de apă, gaz, electricitate și canalizare sunt disponibile la limita proprietății.",
      price: 35,
      priceType: "pe_mp",
      priceSuffix: "€/m²",
      status: "Disponibilă",
      propertyType: "TEREN",
      bedrooms: 0,
      bathrooms: 0,
      rooms: 0,
      usableArea: 0,
      builtArea: 0,
      landArea: 750,
      floors: "Regim aprobat: P, P+1, P+M",
      parking: "Acces stradal direct",
      utilities: "Toate rețelele la limita parcelei",
      constructionStage: "Intravilan liber de sarcini, gata de construire",
      completionDate: "Disponibil imediat",
      address: "Hereclean DC12, Județul Sălaj",
      latitude: 47.236,
      longitude: 23.0118,
      featured: true,
      order: 4,
      facilities: JSON.stringify([
        "Suprafață generoasă 750 m²",
        "Front stradal generos: 22 metri liniari",
        "Teren intravilan cu certificat de urbanism",
        "Utilități la limita parcelei (Apă, Gaz, Curent)",
        "Drum de acces asfaltat recent",
        "Priveliște panoramică neobstrucționată",
        "Zonă în plină dezvoltare rezidențială",
        "Acte la zi, intabulare fără sarcini",
      ]),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=85",
            caption: "Vedere panoramică asupra parcelei",
            isPrimary: true,
            order: 1,
          },
          {
            url: "https://images.unsplash.com/photo-1524813686514-a57563d77d61?auto=format&fit=crop&w=1600&q=85",
            caption: "Amplasare în cadrul natural liniștit",
            isPrimary: false,
            order: 2,
          },
        ],
      },
    },
  });

  console.log("Properties seeded successfully!");

  // 6. Demo Appointments for Dashboard and Timeline testing
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const appt1 = await prisma.appointment.create({
    data: {
      referenceCode: "CR-2026-0001",
      propertyId: prop3.id,
      customerName: "Andrei Pop",
      phone: "0742 334 556",
      email: "andrei.pop@example.com",
      peopleCount: 2,
      message: "Dorim să vedem finisajele de la etaj și stadiul instalației termice.",
      appointmentDate: today,
      appointmentTime: "14:30",
      status: "Confirmată",
      adminNotes: "Client foarte interesat de varianta la cheie. Buget ~140.000 €.",
      statusHistory: {
        create: [
          { oldStatus: "În așteptare", newStatus: "Confirmată", reason: "Confirmat telefonic cu clientul." },
        ],
      },
      notes: {
        create: [
          { note: "Client interesat de varianta semifinisată sau la cheie.", author: "Admin" },
          { note: "Revine după discuția cu banca pentru credit ipotecar.", author: "Admin" },
        ],
      },
    },
  });

  const appt2 = await prisma.appointment.create({
    data: {
      referenceCode: "CR-2026-0002",
      propertyId: prop2.id,
      customerName: "Radu Mureșan",
      phone: "0751 889 221",
      email: "radu.m@example.com",
      peopleCount: 3,
      message: "Vrem să discutăm despre structură și posibilitatea de a prelua casa la roșu.",
      appointmentDate: today,
      appointmentTime: "11:30",
      status: "Efectuată",
      adminNotes: "A fost prezent cu un inginer constructor. Foarte încântați de calitatea cărămizii.",
      statusHistory: {
        create: [
          { oldStatus: "Confirmată", newStatus: "Efectuată", reason: "Vizita s-a desfășurat cu succes." },
        ],
      },
      notes: {
        create: [
          { note: "A solicitat cartea tehnică a construcției.", author: "Admin" },
        ],
      },
    },
  });

  const appt3 = await prisma.appointment.create({
    data: {
      referenceCode: "CR-2026-0003",
      propertyId: prop1.id,
      customerName: "Elena Dumitrescu",
      phone: "0723 445 112",
      email: "elena.d@example.com",
      peopleCount: 2,
      message: "Ne interesează orientarea casei din proiect și termenul de finalizare.",
      appointmentDate: today,
      appointmentTime: "16:30",
      status: "În așteptare",
      adminNotes: "Programare sosită online. Necesită apel pentru confirmare.",
    },
  });

  console.log("Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
