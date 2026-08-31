import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    include: {
      images: { orderBy: { order: "asc" } },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(properties);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const {
      title,
      slug,
      description,
      price,
      priceType = "de_la",
      priceSuffix = "€",
      status = "Disponibilă",
      propertyType,
      bedrooms = 0,
      bathrooms = 0,
      rooms = 0,
      usableArea = 0,
      builtArea = 0,
      landArea = 0,
      floors,
      parking,
      utilities,
      constructionStage,
      completionDate,
      address,
      facilities = [],
      images = [],
      featured = false,
      isHidden = false,
    } = data;

    if (!title || !description || price === undefined) {
      return NextResponse.json({ error: "Titlul, descrierea și prețul sunt obligatorii." }, { status: 400 });
    }

    const calculatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-4)}`;

    const property = await prisma.property.create({
      data: {
        title: title.trim(),
        slug: calculatedSlug,
        description: description.trim(),
        price: Number(price),
        priceType,
        priceSuffix,
        status,
        propertyType: propertyType || "CASĂ",
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        rooms: Number(rooms) || 0,
        usableArea: Number(usableArea) || 0,
        builtArea: Number(builtArea) || 0,
        landArea: Number(landArea) || 0,
        floors: floors || null,
        parking: parking || null,
        utilities: utilities || null,
        constructionStage: constructionStage || null,
        completionDate: completionDate || null,
        address: address || "Hereclean 35/A, DC12, Hereclean, Sălaj",
        featured: Boolean(featured),
        isHidden: Boolean(isHidden),
        facilities: JSON.stringify(facilities),
        images: {
          create: images.map((img: any, idx: number) => ({
            url: img.url,
            caption: img.caption || null,
            isPrimary: img.isPrimary ?? idx === 0,
            order: img.order ?? idx,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json({ success: true, property });
  } catch (e: any) {
    console.error("Create property error:", e);
    return NextResponse.json({ error: e.message || "Eroare la crearea proprietății." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const { id, images, facilities, ...fields } = data;

    if (!id) {
      return NextResponse.json({ error: "ID proprietate lipsă." }, { status: 400 });
    }

    const updatePayload: any = {
      ...fields,
      price: fields.price !== undefined ? Number(fields.price) : undefined,
      bedrooms: fields.bedrooms !== undefined ? Number(fields.bedrooms) : undefined,
      bathrooms: fields.bathrooms !== undefined ? Number(fields.bathrooms) : undefined,
      rooms: fields.rooms !== undefined ? Number(fields.rooms) : undefined,
      usableArea: fields.usableArea !== undefined ? Number(fields.usableArea) : undefined,
      builtArea: fields.builtArea !== undefined ? Number(fields.builtArea) : undefined,
      landArea: fields.landArea !== undefined ? Number(fields.landArea) : undefined,
    };

    if (facilities !== undefined) {
      updatePayload.facilities = JSON.stringify(facilities);
    }

    const updated = await prisma.$transaction(async (tx) => {
      // If new images array provided, replace
      if (images && Array.isArray(images)) {
        await tx.propertyImage.deleteMany({ where: { propertyId: id } });
        await tx.propertyImage.createMany({
          data: images.map((img: any, idx: number) => ({
            propertyId: id,
            url: img.url,
            caption: img.caption || null,
            isPrimary: img.isPrimary ?? idx === 0,
            order: img.order ?? idx,
          })),
        });
      }

      return tx.property.update({
        where: { id },
        data: updatePayload,
        include: {
          images: { orderBy: { order: "asc" } },
        },
      });
    });

    return NextResponse.json({ success: true, property: updated });
  } catch (e: any) {
    console.error("Update property error:", e);
    return NextResponse.json({ error: e.message || "Eroare la actualizarea proprietății." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Neautorizat." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID lipsă." }, { status: 400 });
  }

  await prisma.property.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
