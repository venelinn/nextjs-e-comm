import CartClient from "./CartClient"; // This component will handle fetching client-side

// This is the Server Component wrapper for the Cart page.
export default async function CartPage({
  params,
}: {
  // We use the Promise type here to be resilient to Next.js runtime wrapping
  params: { lang: string } | Promise<{ lang: string }>;
}) {
  // FIX: Await the params object before destructuring to resolve the runtime Promise error.
  const awaitedParams = await params;
  const { lang } = awaitedParams;

  // Pass the short lang code, which the Client Component uses for fetching.
  return <CartClient lang={lang} />;
}
