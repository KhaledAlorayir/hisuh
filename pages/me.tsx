import { Box, Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import useUserLists from "shared/hooks/useUserLists";
import Lists from "components/Lists";
import { useMemo } from "react";

type Props = {
  name: string | null | undefined;
  uid: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
}) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      name: session.user.name,
      uid: session.uid,
    },
  };
};

const me = ({ name, uid }: Props) => {
  const {
    data,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    isSuccess,
  } = useUserLists(uid);

  const lists = useMemo(() => {
    const parsedRes = data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [data]);

  return (
    <Box py={6} h="100%">
      <Heading textAlign="center" size="md">
        Hello {name}!
      </Heading>
      <Box my={12}>
        <Lists
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isSuccess={isSuccess}
          lists={lists}
          text="my lists"
        />
      </Box>
    </Box>
  );
};

export default me;
