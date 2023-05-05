import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function Balance() {
  const { data: session, status } = useSession();

  // Always check for loading status otherwise you're subject to rendering the page while the session still loading
  if (status === "loading") return <div>Loading...</div>;

  return <div>Balance for user {session?.user.name} </div>;
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

  const { fakeId } = context.query;

  if (!(session.user.id.toString() == fakeId)) {
    return {
      redirect: {
        destination: "/401",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
