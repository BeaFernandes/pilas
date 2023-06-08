import { Html, Head, Main, NextScript } from 'next/document'
import { MantineProvider } from '@mantine/core'
import theme from '@/config/theme'
import { Notifications } from '@mantine/notifications'


export default function Document() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Html lang="pt-br">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </MantineProvider>
  )
}
