import { getLocale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function PreviewPage() {
  const locale = await getLocale();
  const content = getContent(locale);

  return (
    <Section className="flex-1 flex items-center justify-center bg-brand-muted/30">
      <Container className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-secondary" style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}>
          {locale === "ar" ? "معاينة الموقع العام" : "Public Website Preview"}
        </h1>
        <p className="text-lg text-brand-muted-fg max-w-xl mx-auto">
          {locale === "ar" 
            ? "هذه صفحة معاينة للهيكل الخارجي (الترويسة والتذييل) باستخدام الهوية البصرية الجديدة."
            : "This is a preview page for the new marketing shell (header/footer) using the brand theme."}
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button asChild variant="brand" size="lg">
            <Link href="/contact">{content.nav.book}</Link>
          </Button>
        </div>
      </Container>
    </Section>
  );
}
