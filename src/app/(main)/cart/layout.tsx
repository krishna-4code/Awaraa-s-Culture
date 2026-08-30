import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Selected Kicks",
  description:
    "Review your selected kicks, apply discount codes, and place your order via Instagram DM. Awaraa's Culture delivers flat ₹100 across Delhi.",
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}