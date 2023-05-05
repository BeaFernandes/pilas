import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";

interface AppPropsWithAuth extends AppProps {
  Component: AppProps["Component"] & { auth: boolean };
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
