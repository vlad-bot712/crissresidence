import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  const properties = await prisma.property.findMany({
    where: { isHidden: false },
    select: {
      id: true,
      slug: true,
      title: true,
      propertyType: true,
      price: true,
      priceSuffix: true,
      status: true,
      address: true,
      images: {
        where: { isPrimary: true },
        select: { url: true },
        take: 1,
      },
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(properties);
}
