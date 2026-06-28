import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Topbar } from "@/components/layout/topbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dubai Property Research Assistant",
  description: "Upload Dubai property documents and chat with them — brochures, SPAs, market reports.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full">
        <TooltipProvider delayDuration={200}>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex flex-1 flex-col">
              <Topbar />
              <main className="flex-1">{children}</main>
            </div>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
