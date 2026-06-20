import type { Metadata } from "next";
import { getLocale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import ContactSocialOrbitSection from "@/components/site/ContactSocialOrbitSection";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.contact;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/contact" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: "/contact",
      images: [{ url: "/site/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      title: seo.title,
      description: seo.description,
      images: ["/site/og-image.jpg"],
    },
  };
}

export default async function ContactPage() {
  return (
    <div className="flex flex-col w-full min-h-screen" style={{ background: "oklch(0.99 0.006 84)" }}>
      <ContactSocialOrbitSection />
    </div>
  );
}
