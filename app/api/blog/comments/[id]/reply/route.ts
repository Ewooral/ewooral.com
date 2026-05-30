import { NextRequest, NextResponse } from "next/server";
import { getWebIdentityToken } from "@/lib/web-identity";

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await getWebIdentityToken();
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Sign in to reply.",
        },
      },
      { status: 401 }
    );
  }

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
    upstream = await fetch(
      `${PLATFORM_API}/api/v1/platform/comments/${encodeURIComponent(id)}/reply`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10000),
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: { code: "SERVICE_UNAVAILABLE", message: "Reply service unreachable." },
      },
      { status: 503 }
    );
  }

  const json = await upstream.json().catch(() => null);
  return NextResponse.json(
    json ?? {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Malformed upstream response" },
    },
    { status: upstream.status }
  );
}
