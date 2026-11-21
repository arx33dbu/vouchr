import ReviewFunnelClient from "@/components/ReviewFunnelClient";

export function generateStaticParams() {
  return [
    { slug: "apex-detailing" },
    { slug: "demo" },
  ];
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ReviewFunnelPage({ params }: PageProps) {
  const resolved = await params;
  return <ReviewFunnelClient slug={resolved.slug} />;
}
