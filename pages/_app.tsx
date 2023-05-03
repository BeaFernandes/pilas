import { SessionProvider, useSession } from "next-auth/react"

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

interface AppPropsWithAuth extends AppProps {
	Component: AppProps['Component'] & { auth: boolean }
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithAuth) {
  return (
    <SessionProvider session={session}>
    {Component.auth ? (
      <Auth>
        <Component {...pageProps} />
      </Auth>
    ) : (
      <Component {...pageProps} />
    )}
  </SessionProvider>
  )
}

function Auth({ children }: { children: any }) {
  const { status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return children
}