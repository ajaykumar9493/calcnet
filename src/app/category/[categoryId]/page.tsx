import type { Metadata } from "next";
import { getCategory } from "@/config/categories";
import { CategoryPageClient } from "./CategoryPageClient";

interface Props {
  params: Promise<{ categoryId: string }>;
}

export async function generateStaticParams() {
  return [
    { categoryId: "financial" },
    { categoryId: "health" },
    { categoryId: "date-time" },
    { categoryId: "unit-converter" },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoryId } = await params;
  const cat = getCategory(categoryId);
  if (!cat) return {};
  return {
    title: `${cat.name} Calculators`,
    description: cat.description,
  };
}

export default function CategoryPage() {
  return <CategoryPageClient />;
}
