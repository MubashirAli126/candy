import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const updateSchema = z.object({
  image: z.string().min(1).optional(),
  eyebrow: z.string().max(60).nullable().optional(),
  title: z.string().max(120).nullable().optional(),
  subtitle: z.string().max(200).nullable().optional(),
  href: z.string().max(300).nullable().optional(),
  cta: z.string().max(40).nullable().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

function clean(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

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
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid slide" },
      { status: 400 }
    );
  }
  const input = parsed.data;

  // Text fields are normalised to null when blank; anything the caller left
  // out stays untouched.
  const data: Record<string, unknown> = {};
  if (input.image !== undefined) data.image = input.image;
  if (input.eyebrow !== undefined) data.eyebrow = clean(input.eyebrow);
  if (input.title !== undefined) data.title = clean(input.title);
  if (input.subtitle !== undefined) data.subtitle = clean(input.subtitle);
  if (input.href !== undefined) data.href = clean(input.href);
  if (input.cta !== undefined) data.cta = clean(input.cta);
  if (input.active !== undefined) data.active = input.active;
  if (input.sortOrder !== undefined) data.sortOrder = input.sortOrder;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const slide = await prisma.heroSlide.update({ where: { id: params.id }, data });
    return NextResponse.json({ slide });
  } catch (error) {
    console.error("Failed to update slide:", error);
    return NextResponse.json({ error: "Slide not found" }, { status: 404 });
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
    await prisma.heroSlide.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete slide:", error);
    return NextResponse.json({ error: "Slide not found" }, { status: 404 });
  }
}
