import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "@/lib/i18n";
import { getContent } from "@/content/site";
import { Container } from "@/components/ui/Container";
import LoadingIndicator from "@/components/ui/LoadingIndicator";
import BookingDetailsForm from "@/components/site/BookingDetailsForm";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = getContent(locale);
  const seo = content.seo.booking;

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/booking/details" },
    robots: { index: false, follow: true },
  };
}

export default async function BookingDetailsPage() {
  const locale = await getLocale();
  const content = getContent(locale);
  const b = content.booking;

  const copy = {
    detailsTitle: b.detailsTitle,
    detailsSubtitle: b.detailsSubtitle,
    summaryDate: b.summaryDate,
    summaryTime: b.summaryTime,
    back: b.back,
    disclaimer: b.disclaimer,
    requiredHint: b.requiredHint,
    changeSelection: b.changeSelection,
    submit: b.submit,
    fields: b.fields,
  };

  return (
    <div className="flex w-full flex-col bg-brand-bg">
      {/* Hero band */}
      <section className="border-b border-brand-border bg-brand-muted/30 pt-20 pb-12 text-center md:pt-28 md:pb-16">
        <Container className="max-w-3xl space-y-4">
          <h1
            className="text-4xl font-bold text-brand-secondary md:text-5xl"
            style={{ fontFamily: "var(--font-display-ar), var(--font-display), serif" }}
          >
            {b.title}
          </h1>
          <p className="text-lg text-brand-muted-fg">{b.detailsSubtitle}</p>
        </Container>
      </section>

      {/* Details form */}
      <section className="py-12 md:py-16">
        <Suspense
          fallback={
            <div className="flex items-center justify-center gap-2 py-16 text-brand-muted-fg">
              <LoadingIndicator />
            </div>
          }
        >
          <BookingDetailsForm locale={locale} copy={copy} />
        </Suspense>
      </section>
    </div>
  );
}
