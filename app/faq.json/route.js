import { buildFaqJsonExport } from "../../lib/seo/faq-data";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return Response.json(buildFaqJsonExport(), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
