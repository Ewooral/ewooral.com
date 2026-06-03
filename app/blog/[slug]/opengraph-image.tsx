import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ewooral blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

type BlogPostDetail = {
  slug: string;
  title: string;
  dek?: string;
  excerpt?: string;
  category?: { label: string } | null;
  author_name?: string;
};

async function getPost(slug: string): Promise<BlogPostDetail | null> {
  try {
    const res = await fetch(
      `${PLATFORM_API}/api/v1/platform/posts/${encodeURIComponent(slug)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as Envelope<BlogPostDetail>;
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}

export default async function BlogOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "Ewooral blog";
  const blurb = post?.dek ?? post?.excerpt ?? "Field notes from Ewooral & BFAM Holdings.";
  const category = post?.category?.label ?? "Field notes";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f7f4ea",
          color: "#171717",
          padding: "64px",
          borderTop: "14px solid #d99500",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700 }}>Ewooral & BFAM</div>
          <div style={{ fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "#d99500" }}>
            {category}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 920 }}>
          <div style={{ fontSize: 70, lineHeight: 0.98, fontWeight: 800, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ fontSize: 30, lineHeight: 1.35, color: "#4f4f4f", maxWidth: 820 }}>
            {blurb}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 22, color: "#0b4a32", fontWeight: 700 }}>ewooral.com/blog</div>
          <div style={{ width: 92, height: 92, borderRadius: 46, background: "#0b4a32", color: "#d99500", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800 }}>
            BF
          </div>
        </div>
      </div>
    ),
    size
  );
}
