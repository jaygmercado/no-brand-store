"use client";
import "./globals.css";
import React from "react";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <main>
          <SessionProvider>
            <ToastContainer />
            {children}
          </SessionProvider>
        </main>
      </body>
    </html>
  );
}
