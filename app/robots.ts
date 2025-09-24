export default function robots() {
  const host = process.env.NEXT_PUBLIC_SITE_URL ?? "https://your-vercel-url";
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${host}/sitemap.xml`,
    host,
  };
}
