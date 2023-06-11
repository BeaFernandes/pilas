import { Notifications } from "@mantine/notifications";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from '../components/Layout'
import { MantineProvider } from '@mantine/core'
import theme from '@/config/theme'
import { DatesProvider } from "@mantine/dates";
import 'dayjs/locale/pt-br'
import 'moment/locale/pt-br'

interface AppPropsWithAuth extends AppProps {
  Component: AppProps["Component"] & { auth: boolean };
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <SessionProvider session={session}>
        <DatesProvider settings={{ locale: 'pt-br' }}>
          <Notifications />
            <Component {...pageProps} />
        </DatesProvider>
      </SessionProvider>
    </MantineProvider>  
  );
}
