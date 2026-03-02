import type { Metadata } from "next";
import { Inter, Fira_Code } from "next/font/google";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AkshitOS | Developer Productivity Dashboard",
  description: "A professional productivity OS for developers, inspired by BizNest.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${firaCode.variable} antialiased bg-bg-primary text-text-primary`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
