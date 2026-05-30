import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://bfam-backend-api.ewooral.com";

const COOKIE_NAME = "ewooral_identity";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Invalid JSON body" },
      },
      { status: 400 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BACKEND_URL}/api/v1/auth/register-web`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Sign-up service is temporarily unreachable. Please try again in a moment.",
        },
      },
      { status: 503 }
    );
  }

  const json = await upstream.json().catch(() => null);

  if (!upstream.ok || !json?.success) {
    return NextResponse.json(
      json ?? {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Upstream error" },
      },
      { status: upstream.status }
    );
  }

  const token: string | undefined = json?.data?.token;
  const user = json?.data?.user;

  if (!token || !user) {
    return NextResponse.json(
      {
        success: false,
        error: { code: "INTERNAL_ERROR", message: "Malformed upstream response" },
      },
      { status: 502 }
    );
  }

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return NextResponse.json({ success: true, data: { user } });
}
