import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"


export default function Home() {
  const { data: session, status } = useSession()

  if (status === "authenticated") {
    return (
      <>
        <p>Logado como {session.user?.name}</p>
        <button onClick={() => signOut()}>Sair</button>
      </>
    )
  }

  return <a href="/api/auth/signin">Fazer Login</a>
}
