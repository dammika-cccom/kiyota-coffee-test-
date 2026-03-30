import type { Metadata } from "next";
import "./globals.css"; // The only place CSS is imported
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Kiyota Coffee Roasters",
  description: "Japanese precision meeting Ceylon heritage.",
  icons: { icon: "/images/favicon.ico" } 
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* 
          The body tag stays here. 
          We use only 'antialiased' here to keep it neutral for Admin.
      */}
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}