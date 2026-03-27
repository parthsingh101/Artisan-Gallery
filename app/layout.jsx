import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";
import { Toaster } from "react-hot-toast";

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Artisan Gallery — Original Paintings & Sketches",
    template: "%s | Artisan Gallery",
  },
  description:
    "Discover and collect original handcrafted paintings and sketches from talented artists. Premium art for your home and workspace.",
  keywords: ["paintings", "sketches", "art", "buy art", "original art", "gallery"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Artisan Gallery",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable}`}>
      <body className="font-body bg-white text-ink antialiased">
        <AppProviders>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-body)",
                borderRadius: "8px",
                border: "1px solid #e2be96",
              },
            }}
          />
        </AppProviders>
      </body>
    </html>
  );
}
