import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from '../components/Layout'
import 'moment/locale/pt-br'

interface AppPropsWithAuth extends AppProps {
  Component: AppProps["Component"] & { auth: boolean };
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <SessionProvider session={session}>
      <Notifications />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}
