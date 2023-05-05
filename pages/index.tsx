import containsRole from "@/utils/auth/containsRole";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <span>Loading...</span>;

  if (status === "authenticated") {
    if (!containsRole(session?.user, "ADMIN"))
      return <span>You must be admin to access this page!</span>;

    return (
      <>
        <p>Logado como {session.user?.name}</p>
        <button onClick={() => signOut()}>Sair</button>
      </>
    );
  }

  return <Link href="/api/auth/signin">Fazer Login</Link>;
}
