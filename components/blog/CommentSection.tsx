import CommentThread, { type Comment } from "./CommentThread";

const PLATFORM_API =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL ??
  "https://platform-api.ewooral.com";

type Envelope<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: { code: string; message: string } };

type CommentsPage = {
  items: Comment[];
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
};

async function getComments(slug: string): Promise<Comment[]> {
  try {
    const res = await fetch(
      `${PLATFORM_API}/api/v1/platform/posts/${encodeURIComponent(slug)}/comments?limit=100`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const json = (await res.json()) as Envelope<CommentsPage>;
    if (!json.success) return [];
    return json.data.items ?? [];
  } catch {
    return [];
  }
}

type ViewerInput = { sub: string; name: string } | null;

export default async function CommentSection({
  slug,
  postId,
  viewer,
}: {
  slug: string;
  postId: string;
  viewer: ViewerInput;
}) {
  const comments = await getComments(slug);
  return (
    <CommentThread
      slug={slug}
      postId={postId}
      initialComments={comments}
      viewer={viewer}
    />
  );
}
