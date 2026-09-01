import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { STICKER_TYPES } from "@/lib/types";
import { serializeGallery } from "@/lib/utils";
import { MAX_IMAGES } from "@/lib/media";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  price: z.number().positive().optional(),
  salePrice: z.number().positive().nullable().optional(),
  image: z.string().min(1).optional(),
  // Ordered gallery; the first entry replaces `image`, the rest go to `images`.
  images: z.array(z.string().min(1)).min(1).max(MAX_IMAGES).optional(),
  video: z.string().min(1).nullable().optional(),
  // Sizes and their per-size prices, packed into one string by
  // serializeSizeOptions(), e.g. "10x10 cm=250 | 12x20 cm=400".
  size: z.string().max(1000).nullable().optional(),
  stock: z.number().int().min(0).optional(),
  categoryId: z.string().min(1).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  tags: z.string().nullable().optional(),
  stickerType: z.enum(STICKER_TYPES).optional(),
  customType: z.string().max(40).nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid data" },
      { status: 400 }
    );
  }

  const { images: gallery, ...rest } = parsed.data;
  const data: Prisma.ProductUpdateInput = { ...rest };

  // A gallery replaces both picture fields at once so main image and extras
  // always come from the same submission.
  if (gallery) {
    const serialized = serializeGallery(gallery);
    if (!serialized) {
      return NextResponse.json(
        { error: "At least one picture is required" },
        { status: 400 }
      );
    }
    data.image = serialized.image;
    data.images = serialized.images;
  }

  // Keep stickerType and customType consistent: the free-text type only exists
  // for OTHER. Fall back to the stored type for partial updates that change one
  // field but not the other.
  if (rest.stickerType !== undefined || rest.customType !== undefined) {
    const existing = await prisma.product.findUnique({
      where: { id: params.id },
      select: { stickerType: true },
    });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const effectiveType = rest.stickerType ?? existing.stickerType;
    data.customType =
      effectiveType === "OTHER" ? rest.customType?.trim() || null : null;
  }

  try {
    await prisma.product.update({
      where: { id: params.id },
      data,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Soft-delete if the product has orders (preserve history); else hard delete.
    const orderItemCount = await prisma.orderItem.count({
      where: { productId: params.id },
    });
    if (orderItemCount > 0) {
      await prisma.product.update({
        where: { id: params.id },
        data: { active: false },
      });
      return NextResponse.json({ ok: true, softDeleted: true });
    }
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
