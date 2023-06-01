import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]";

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
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};