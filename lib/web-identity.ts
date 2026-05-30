import { cookies } from "next/headers";

export const WEB_IDENTITY_COOKIE = "ewooral_identity";

export type WebIdentityClaims = {
  sub: string;
  name: string;
  email: string;
  product_origin: string;
  roles: string[];
  iat: number;
  exp: number;
};

/**
 * Decode the JWT payload WITHOUT signature verification.
 *
 * The platform-api + bfam-backend verify the signature on every authenticated
 * call we proxy. This helper only exists so the *UI* can show "Hi, Ama" /
 * decide whether to render a comment form. Never trust this for authorization.
 */
function decodeJwtPayload(token: string): WebIdentityClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(
      Buffer.from(padded, "base64").toString("utf-8")
    );
    if (typeof payload?.sub !== "string") return null;
    return payload as WebIdentityClaims;
  } catch {
    return null;
  }
}

/** Server-only. Returns the raw JWT (for proxy bearer forwarding) or null. */
export async function getWebIdentityToken(): Promise<string | null> {
  const jar = await cookies();
  const t = jar.get(WEB_IDENTITY_COOKIE)?.value;
  return t ?? null;
}

/**
 * Server-only. Returns the current viewer's claims, or null if not signed in
 * or token expired. Does not verify signature — only inspects exp + presence.
 */
export async function getCurrentViewer(): Promise<WebIdentityClaims | null> {
  const token = await getWebIdentityToken();
  if (!token) return null;
  const claims = decodeJwtPayload(token);
  if (!claims) return null;
  if (claims.exp && claims.exp * 1000 < Date.now()) return null;
  return claims;
}
