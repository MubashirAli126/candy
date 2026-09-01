import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "cp_admin_session";
const ONE_WEEK = 60 * 60 * 24 * 7; // seconds

/**
 * Read an env var, tolerating the two things that survive a dashboard copy-paste:
 * surrounding quotes (as written in .env.example) and stray whitespace.
 */
function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (!raw) return undefined;
  const value = raw.trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
  return value.length > 0 ? value : undefined;
}

function getSecretKey(): Uint8Array {
  const secret = readEnv("AUTH_SECRET");
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET is missing or too short. Set a long random string in .env"
    );
  }
  return new TextEncoder().encode(secret);
}

/** Validate submitted credentials against the admin account in .env */
export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = readEnv("ADMIN_EMAIL");
  const adminPassword = readEnv("ADMIN_PASSWORD");
  if (!adminEmail || !adminPassword) {
    console.error(
      `Admin login is not configured: ${!adminEmail ? "ADMIN_EMAIL" : ""}${
        !adminEmail && !adminPassword ? " and " : ""
      }${!adminPassword ? "ADMIN_PASSWORD" : ""} missing from the environment.`
    );
    return false;
  }

  const emailOk = email.trim().toLowerCase() === adminEmail.toLowerCase();
  const passwordOk = password === adminPassword;
  if (!emailOk || !passwordOk) {
    // Lengths only — never the values. Tells apart "wrong password" from
    // "env var carries extra quotes/whitespace" without leaking the secret.
    console.error(
      `Admin login rejected: email ${emailOk ? "ok" : "mismatch"}, password ${
        passwordOk ? "ok" : "mismatch"
      } (submitted ${password.length} chars, configured ${
        adminPassword.length
      } chars).`
    );
  }
  return emailOk && passwordOk;
}

/** Create a signed session token for the admin. */
export async function createSessionToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ONE_WEEK}s`)
    .sign(getSecretKey());
}

/** Set the session cookie (call from a Route Handler / Server Action). */
export function setSessionCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ONE_WEEK,
  });
}

export function clearSessionCookie() {
  cookies().set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
}

/** Returns the admin session payload if valid, else null. */
export async function getSession(): Promise<{ email: string } | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin") return null;
    return { email: payload.email as string };
  } catch {
    return null;
  }
}
