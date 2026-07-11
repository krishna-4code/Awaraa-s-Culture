import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/commerce";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  // In Phase 4, we use placeholder metadata structure
  return {
    title: `[[PRODUCT NAME FOR ${id.toUpperCase()}]] - Awaraa's Culture`,
    description: "Built for movement, designed for stillness. This pair represents our standard for daily reliability.",
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
