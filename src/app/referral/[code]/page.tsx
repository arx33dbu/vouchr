import CustomerReferralClient from "@/components/CustomerReferralClient";

export function generateStaticParams() {
  return [
    { code: "DAVID-20" },
    { code: "ALEX-20" },
    { code: "SARAH-20" },
    { code: "demo" },
  ];
}

interface PageProps {
  params: Promise<{ code: string }>;
}

export default async function CustomerReferralPage({ params }: PageProps) {
  const resolved = await params;
  return <CustomerReferralClient code={resolved.code} />;
}
