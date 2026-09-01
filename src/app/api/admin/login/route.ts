import { NextResponse } from "next/server";
import { z } from "zod";
import {
  verifyCredentials,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid email and password." },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  if (!verifyCredentials(email, password)) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(email);
  setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
