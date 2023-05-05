import containsRole from "@/utils/auth/containsRole";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Mayor() {
  const { data: session, status } = useSession();

  // Always check for loading status otherwise you're subject to rendering the page while the session still loading
  if (status === "loading") return <div>Loading...</div>;

  return (
    <>
      <h2> Mayor secret dashboard </h2>
      <p>Usuário: {session?.user.name}</p> 

      <button onClick={() => signOut()}>Sair</button>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (
    !session ||
    !(
      // both admin and mayor are accepted for this page
      (
        containsRole(session.user, "MAYOR") ||
        containsRole(session.user, "ADMIN")
      )
    )
  ) {
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
