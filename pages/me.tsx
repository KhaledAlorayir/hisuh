import { Box, Divider, Heading } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import useUserLists from "shared/hooks/useUserLists";
import useUserLikes from "shared/hooks/useUserLikes";
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
  const myLists = useUserLists(uid);
  const myLikes = useUserLikes(uid);

  const lists = useMemo(() => {
    const parsedRes = myLists.data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [myLists.data]);

  const likes = useMemo(() => {
    const parsedRes = myLikes.data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [myLikes.data]);

  return (
    <Box py={6} h="100%">
      <Heading mb={4} textAlign="center" size="md">
        Hello {name}!
      </Heading>
      <Divider />
      <Box my={12}>
        <Lists
          fetchNextPage={myLists.fetchNextPage}
          hasNextPage={myLists.hasNextPage}
          isFetchingNextPage={myLists.isFetchingNextPage}
          isLoading={myLists.isLoading}
          isSuccess={myLists.isSuccess}
          lists={lists}
          text="my lists"
        />
      </Box>
      <Divider />
      <Box my={12}>
        <Lists
          fetchNextPage={myLikes.fetchNextPage}
          hasNextPage={myLikes.hasNextPage}
          isFetchingNextPage={myLikes.isFetchingNextPage}
          isLoading={myLikes.isLoading}
          isSuccess={myLikes.isSuccess}
          lists={likes}
          text="my likes"
        />
      </Box>
    </Box>
  );
};

export default me;
