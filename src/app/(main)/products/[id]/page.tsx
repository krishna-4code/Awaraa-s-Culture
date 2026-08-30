import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { getProduct } from "@/lib/commerce";
import { generateProductMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product not found",
      description: "This pair could not be found. Explore the rest of the Awaraa's Culture squad.",
    };
  }

  return generateProductMetadata({
    name: product.name,
    description: product.description,
    handle: product.handle,
    imageUrl: product.images?.[0]?.url,
  });
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
