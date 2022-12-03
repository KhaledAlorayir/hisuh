import { GetServerSideProps } from "next";
import { z } from "zod";
import prisma from "shared/prisma";
import { UserDTO } from "shared/types";
import { Avatar, Box, Text } from "@chakra-ui/react";
import useUserLists from "shared/hooks/useUserLists";
import { useMemo } from "react";
import Lists from "components/Lists";

type Props = {
  user: UserDTO;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const uid_schema = z.object({
    user_id: z.string().cuid(),
  });

  const validatedUid = uid_schema.safeParse(query);

  if (!validatedUid.success) {
    return {
      notFound: true,
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: validatedUid.data.user_id,
    },
    select: {
      id: true,
      image: true,
      name: true,
    },
  });

  if (!user) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      user,
    },
  };
};

const User = ({ user: { id, image, name } }: Props) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isSuccess,
  } = useUserLists(id);

  const lists = useMemo(() => {
    const parsedRes = data?.pages.map(({ lists }) => lists);
    return parsedRes?.flat();
  }, [data]);

  return (
    <Box h="100%" py={6}>
      <Box textAlign="center" mb={10}>
        <Avatar
          size={{ base: "md", md: "lg" }}
          src={image || undefined}
          name={name || ""}
          mb={2}
        />
        <Text fontSize="lg" fontWeight="semibold" fontFamily="mono">
          {name}
        </Text>
      </Box>
      <Box>
        <Lists
          lists={lists}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isLoading={isLoading}
          isSuccess={isSuccess}
          text="user lists"
        />
      </Box>
    </Box>
  );
};

export default User;
