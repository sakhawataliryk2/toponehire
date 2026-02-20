import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopOneHire - Search 10,306 live jobs | Elevate your career",
  description: "Search thousands of live jobs and elevate your career with TopOneHire. Find jobs by category, location, and company.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '6Le5S20sAAAAABx0iFJVJw6Ft32Xy9KL0J_F9kdg'}`}
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  );
}
