import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";

export default function User() {
  const { data: session, status } = useSession();

  // Always check for loading status otherwise you're subject to rendering the page while the session still loading
  if (status === "loading") return <div>Loading...</div>;

  return (
    <>
      <h2> Meu perfil </h2>
      <p>Usuário: {session?.user.name}</p> 
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // no need to check roles here, all are accepted as well as the user is logged in
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  // Destination with callback URL: `/api/auth/signin?error=SessionRequired&callbackUrl=${process.env.NEXTAUTH_URL}admin`

  return {
    props: {},
  };
};
