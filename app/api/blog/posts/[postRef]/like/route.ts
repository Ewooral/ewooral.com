import { NextRequest, NextResponse } from "next/server";
import { getWebIdentityToken } from "@/lib/web-identity";

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

async function proxy(req: NextRequest, method: "POST" | "DELETE", id: string) {
  const token = await getWebIdentityToken();
  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "Sign in to like this post.",
        },
      },
      { status: 401 }
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(
      `${PLATFORM_API}/api/v1/platform/posts/${encodeURIComponent(id)}/like`,
      {
        method,
        headers: { Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(10000),
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVICE_UNAVAILABLE",
          message: "Like service is temporarily unreachable.",
        },
      },
      { status: 503 }
    );
  }

  const body = await upstream.json().catch(() => null);
  return NextResponse.json(
    body ?? {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Malformed upstream response" },
    },
    { status: upstream.status }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postRef: string }> }
) {
  const { postRef } = await params;
  return proxy(req, "POST", postRef);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postRef: string }> }
) {
  const { postRef } = await params;
  return proxy(req, "DELETE", postRef);
}
