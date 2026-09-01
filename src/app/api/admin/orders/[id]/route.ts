import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/types";

const schema = z.object({
  status: z.enum(ORDER_STATUSES),
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

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    await prisma.order.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}
