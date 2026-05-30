import { NextResponse } from "next/server";
import { getCurrentViewer } from "@/lib/web-identity";

export async function GET() {
  const viewer = await getCurrentViewer();

  return NextResponse.json(
    {
      success: true,
      data: {
        viewer: viewer
          ? {
              sub: viewer.sub,
              name: viewer.name,
              email: viewer.email,
              product_origin: viewer.product_origin,
              roles: viewer.roles,
            }
          : null,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
