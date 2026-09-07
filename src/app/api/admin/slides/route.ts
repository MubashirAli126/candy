import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAllSlides } from "@/lib/slides";

// Only the picture is required — an admin can publish a plain banner with a
// single upload and add copy later.
const slideSchema = z.object({
  image: z.string().min(1),
  eyebrow: z.string().max(60).nullable().optional(),
  title: z.string().max(120).nullable().optional(),
  subtitle: z.string().max(200).nullable().optional(),
  href: z.string().max(300).nullable().optional(),
  cta: z.string().max(40).nullable().optional(),
  active: z.boolean().optional(),
});

/** Trim to null so blank form fields never store an empty string. */
function clean(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ slides: await getAllSlides() });
}

export async function POST(request: Request) {
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

  const parsed = slideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid slide" },
      { status: 400 }
    );
  }
  const input = parsed.data;

  try {
    // New slides go to the end of the carousel.
    const last = await prisma.heroSlide.findFirst({
      orderBy: { sortOrder: "desc" },
      select: { sortOrder: true },
    });

    const slide = await prisma.heroSlide.create({
      data: {
        image: input.image,
        eyebrow: clean(input.eyebrow),
        title: clean(input.title),
        subtitle: clean(input.subtitle),
        href: clean(input.href),
        cta: clean(input.cta),
        active: input.active ?? true,
        sortOrder: (last?.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json({ slide }, { status: 201 });
  } catch (error) {
    console.error("Failed to create slide:", error);
    return NextResponse.json(
      { error: "Failed to save the slide. Please try again." },
      { status: 500 }
    );
  }
}
