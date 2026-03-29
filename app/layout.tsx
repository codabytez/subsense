import type { Metadata } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/providers/convex-provider";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { getToken } from "@/lib/auth-server";
import { Toaster } from "sonner";

// Variable fonts — full weight range loaded automatically
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });

// DM Mono is not a variable font — weights must be explicit
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://subsense.unbuilt.studio"),
  title: {
    default: "Subsense",
    template: "%s | Subsense",
  },
  description: "Subscription management, simplified.",
  openGraph: {
    title: "Subsense",
    description: "Subscription management, simplified.",
    type: "website",
    siteName: "Subsense",
    url: "https://subsense.unbuilt.studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subsense",
    description: "Subscription management, simplified.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Subsense",
  },
  icons: {
    apple: "/favicon/apple-touch-icon.png",
  },
  other: {
    "theme-color": "#0e0e13",
    "apple-mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken().catch(() => null);

  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <ConvexClientProvider initialToken={token}>
          <QueryProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryProvider>
        </ConvexClientProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
