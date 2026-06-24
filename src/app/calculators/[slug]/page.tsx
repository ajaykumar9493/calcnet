import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getCalculator, calculators } from "@/config/calculators";
import { getCategory } from "@/config/categories";
import { getCalculatorComponent } from "@/components/calculators/registry";
import { generateCalculatorJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return calculators.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  return {
    title: calc.name,
    description: calc.description,
    alternates: { canonical: `/calculators/${slug}` },
    openGraph: {
      title: calc.name,
      description: calc.shortDescription,
      url: `/calculators/${slug}`,
    },
  };
}

export default async function CalculatorPage({ params }: Props) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  const Component = getCalculatorComponent(slug);
  if (!Component) notFound();

  const cat = getCategory(calc.category);
  const jsonLd = generateCalculatorJsonLd(calc, BASE_URL);
  const breadcrumb = generateBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: cat?.name ?? calc.category, url: `${BASE_URL}/category/${calc.category}` },
    { name: calc.name, url: `${BASE_URL}/calculators/${slug}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <nav className="text-sm text-zinc-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        {" / "}
        <Link href={`/category/${calc.category}`} className="hover:text-blue-600">{cat?.name}</Link>
        {" / "}
        <span className="text-zinc-700 dark:text-zinc-300">{calc.name}</span>
      </nav>
      <h1 className="mt-2 text-3xl font-bold">{calc.name}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{calc.description}</p>
      <div className="mt-8">
        <Suspense fallback={<div className="text-zinc-500">Loading calculator...</div>}>
          <Component />
        </Suspense>
      </div>
    </div>
  );
}
