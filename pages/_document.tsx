import { Html, Head, Main, NextScript } from 'next/document'
import { MantineProvider } from '@mantine/core'
import theme from '@/config/theme'


export default function Document() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    </MantineProvider>
  )
}
