import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { generateMetadata, generateViewport } from '@/lib/seo';
import { getOrganizationSchema, getWebApplicationSchema } from '@/lib/schema';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
});

export const viewport: Viewport = generateViewport();
export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id-ID" className={inter.variable} suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebApplicationSchema()) }}
        />
        <style dangerouslySetInnerHTML={{
          __html: `
          body {
            background-color: hsl(var(--background));
            color: hsl(var(--foreground));
            margin: 0;
            font-family: var(--font-inter), sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          /* Prevent layout shift during chart loading and isolate reflows */
          .chart-container {
            contain: strict;
            content-visibility: auto;
            contain-intrinsic-size: 350px;
            min-height: 350px;
            overflow: hidden;
            background: rgba(var(--muted), 0.05);
            border-radius: 2rem;
          }
          .skeleton {
            background: linear-gradient(90deg, rgba(var(--muted), 0.1) 25%, rgba(var(--muted), 0.2) 50%, rgba(var(--muted), 0.1) 75%);
            background-size: 200% 100%;
            animation: skeleton-loading 1.5s infinite linear;
          }
          @keyframes skeleton-loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}} />
      </head>
      <body className={`${inter.className} antialiased selection:bg-primary/30 selection:text-primary-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="finance-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
