import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <span>Loading...</span>;

  if (status === "authenticated") {
    return (
      <>
        <p>Logado como {session.user?.name}</p>
        <button onClick={() => signOut()}>Sair</button>
      </>
    );
  }

  return (
    <>
      <p>Bem-vindo ao sistema dos Pilas</p>
      <Link href="/api/auth/signin">Fazer Login</Link>
    </>
  )
}