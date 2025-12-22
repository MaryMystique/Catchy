import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { DarkModeProvider } from "@/contexts/DarkModeContext";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Catchy - Task Management Made Simple",
  description: "Catchy is a modern task management web application that helps users organise their projects, track tasks efficiently, and boost productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.className} antialiased`} >
          <DarkModeProvider>
          <AuthProvider>
          <Navbar />
        {children}
        <ToastProvider />
        <Footer />
        </AuthProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}
