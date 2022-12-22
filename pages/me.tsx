import { Box, Center, Divider, Heading, Spinner } from "@chakra-ui/react";
import useUserLists from "shared/hooks/useUserLists";
import useUserLikes from "shared/hooks/useUserLikes";
import Lists from "components/Lists";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

type Props = {};

const me = (props: Props) => {
  const { data, status } = useSession({
    required: true,
  });

  const myLists = useUserLists(data?.uid);
  const myLikes = useUserLikes(data?.uid);

  const lists = useMemo(() => {
    const parsedRes = myLists.data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [myLists.data]);

  const likes = useMemo(() => {
    const parsedRes = myLikes.data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [myLikes.data]);

  if (status === "loading") {
    return (
      <Center h="100%">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box py={6} h="100%">
      <Heading mb={4} textAlign="center" size="md">
        Hello {data.user?.name}!
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
