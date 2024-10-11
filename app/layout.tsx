import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Exam Essentials",
  description: "Exam Essentials empowers students to maximize their exam preparation by analyzing past papers, identifying key patterns, and providing personalized study guidance. Unlock insights that help you focus on what truly matters for academic success.",
  keywords: "exam preparation, study tools, question analysis, topic insights, academic success",
 
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="B4ZnJoW2rX06OYOo3nxFp6QGNUTIXEIxYX0YbqiXZo4" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
