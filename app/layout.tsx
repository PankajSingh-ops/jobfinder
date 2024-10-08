import type { Metadata } from "next";
import localFont from "next/font/local";
import StoreProvider from "./storeProvider";
import "./globals.css";
import { EdgeStoreProvider } from "@/lib/edgestore";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "JobFinder",
  description: "Best Place to find Jobs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`} style={{ margin:"0", padding:"0" }}>
      <StoreProvider>
      <EdgeStoreProvider>
        {children}
        </EdgeStoreProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
