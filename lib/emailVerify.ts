const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://bfam-backend-api.ewooral.com";

type ApiSuccess<T> = { success: true; data: T; message?: string };
type ApiError = { success: false; error: { code: string; message: string } };

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json: ApiSuccess<T> | ApiError = await res.json();
  if (!json.success) {
    throw new Error((json as ApiError).error?.message || "Request failed");
  }
  return (json as ApiSuccess<T>).data;
}

export function sendEmailVerification(email: string) {
  return post<{ expires_in_seconds: number }>(
    "/api/v1/ahofe/auth/send-email-verification",
    { email },
  );
}

export function verifyEmailCode(email: string, code: string) {
  return post<{ verified: true }>(
    "/api/v1/ahofe/auth/verify-email-code",
    { email, code },
  );
}
