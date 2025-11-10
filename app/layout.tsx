import "@/styles/globals.scss";
import type { Metadata } from "next";

// This is the root layout. It does not know the language.
// We will set the 'lang' attribute on the client in the provider.

export const metadata: Metadata = {
  title: "My Website",
  description: "Next.js App Router version",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // We can't set a dynamic 'lang' here, so we'll let the
    // client provider do it. 'suppressHydrationWarning' is
    // recommended when you modify the <html> tag on the client.
    <html lang="en" suppressHydrationWarning>
      <body>
        {/*
          We do NOT wrap with ClientLayout here.
          The [lang]/layout.tsx will do that.
        */}
        {children}
      </body>
    </html>
  );
}
