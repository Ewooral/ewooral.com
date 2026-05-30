import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { WEB_IDENTITY_COOKIE } from "@/lib/web-identity";

export async function POST() {
  const jar = await cookies();
  jar.delete(WEB_IDENTITY_COOKIE);

  return NextResponse.json({ success: true, data: { signed_out: true } });
}
