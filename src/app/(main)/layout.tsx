import { SmoothScroll } from "@/components/SmoothScroll";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (e) {
    user = null;
  }

  return (
    <>
      <Nav user={user} />
      <SmoothScroll>
        <div className="flex flex-col min-h-screen">
          {children}
        </div>
        <Footer />
      </SmoothScroll>
    </>
  );
}
