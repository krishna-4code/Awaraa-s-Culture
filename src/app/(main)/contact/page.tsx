import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Awaraa\'s Culture team for support, sizing help, and order updates.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-bright-canvas text-bright-ink pt-28 pb-32 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-10">
        
        {/* Breadcrumb */}
        <Link
          href="/"
          className="font-sans text-xs font-semibold uppercase tracking-widest text-bright-muted hover:text-bright-amber transition-colors inline-flex items-center gap-1"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div>
          <span className="font-sans text-xs uppercase tracking-widest text-bright-amber font-bold block mb-2">
            ✦ We&apos;re Here To Help
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl uppercase tracking-tight text-bright-ink">
            Get In Touch
          </h1>
          <p className="font-sans text-sm text-bright-muted mt-2">
            Questions regarding sizing, shipping, or squad drops? Reach out directly.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="cpg-card bg-white p-6 flex flex-col gap-3 border border-bright-ink/10">
            <div className="w-10 h-10 rounded-full bg-bright-amber/10 text-bright-amber flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg uppercase text-bright-ink">Email Support</h2>
            <p className="text-xs text-bright-muted">Direct replies within 24 hours.</p>
            <a href="mailto:support@awaraasculture.in" className="text-xs font-bold text-bright-amber hover:underline mt-2">
              support@awaraasculture.in
            </a>
          </div>

          <div className="cpg-card bg-white p-6 flex flex-col gap-3 border border-bright-ink/10">
            <div className="w-10 h-10 rounded-full bg-bright-lime/10 text-bright-lime flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg uppercase text-bright-ink">WhatsApp & Chat</h2>
            <p className="text-xs text-bright-muted">Mon–Sat, 10 AM to 7 PM IST.</p>
            <span className="text-xs font-bold text-bright-ink mt-2">
              +91 (NCR Support Desk)
            </span>
          </div>

          <div className="cpg-card bg-white p-6 flex flex-col gap-3 border border-bright-ink/10">
            <div className="w-10 h-10 rounded-full bg-bright-coral/10 text-bright-coral flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-display font-bold text-lg uppercase text-bright-ink">Headquarters</h2>
            <p className="text-xs text-bright-muted">Design Studio & Fulfillment Hub</p>
            <span className="text-xs font-bold text-bright-ink mt-2">
              Delhi NCR, India
            </span>
          </div>
        </div>

        {/* Footer info banner */}
        <div className="p-5 rounded-2xl bg-bright-card border border-bright-ink/10 text-xs text-bright-muted leading-relaxed">
          <strong className="text-bright-ink">Official Seller Entity:</strong> Awaraa&apos;s Culture Lifestyle LLP • GSTIN: [[GST Registration In Process]] • Delhi NCR, India.
        </div>

      </div>
    </main>
  );
}
