import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Selected Kicks",
  description:
    `Review your selected kicks, apply discount codes, and place your order via Instagram DM. ${BRAND_NAME} delivers flat ₹100 across Delhi.`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}