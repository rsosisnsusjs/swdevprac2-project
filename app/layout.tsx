import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import { Analytics } from '@vercel/analytics/next'
import "./globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookYourBooth - Exhibition Booth Booking",
  description: "Professional exhibition booth booking system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
