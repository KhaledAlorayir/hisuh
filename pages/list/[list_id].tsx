import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ListIdParamsSchema } from "shared/schemas";
import prisma from "shared/prisma";
import { Entry, ParsedList } from "shared/types";
import ListInfoMap from "components/ListInfoMap";
import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import ListInfoTitle from "components/ListInfoTitle";
import Like from "components/listInfo/Like";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import PlacesList from "components/listInfo/PlacesList";
import daysjs from "dayjs";
import rt from "dayjs/plugin/relativeTime";
import Share from "components/Share";

daysjs.extend(rt);

type Props = {
  entries: Entry[];
  list: ParsedList;
  likes_count: number;
  isLiked: boolean;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
  req,
  res,
}) => {
  const params = ListIdParamsSchema.safeParse(query);

  if (!params.success) {
    return {
      notFound: true,
    };
  }

  const list = await prisma.list.findUnique({
    where: {
      id: params.data.list_id,
    },
    include: {
      entries: {
        include: {
          spot: true,
        },
      },
      owner: {
        select: {
          name: true,
          image: true,
          id: true,
        },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  if (!list) {
    return {
      notFound: true,
    };
  }

  const auth = await unstable_getServerSession(req, res, authOptions);
  let isLiked = false;

  if (auth) {
    const exist = await prisma.like.findUnique({
      where: {
        list_id_user_id: { list_id: params.data.list_id, user_id: auth.uid },
      },
    });

    if (exist) {
      isLiked = true;
    }
  }

  const entries: Entry[] = list.entries.map(
    ({ id, spot: { lat, lon, place_id }, name, description }) => ({
      id,
      lat,
      lon,
      name,
      description: description,
      place_id: place_id,
    })
  );

  return {
    props: {
      entries,
      list: JSON.parse(JSON.stringify(list)) as ParsedList,
      likes_count: list._count.likes,
      isLiked,
    },
  };
};

/*
  TODO:
  -Migrate db to supabasee
  -set placeslist in conform

  2- bookmarks list
  3- users page showing there lists
  4- ud lists
  1- private list  
*/

const ListInfo = ({
  entries,
  list,
  likes_count,
  isLiked,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Box h="100%" py={6}>
      <ListInfoTitle name={list.name} description={list.description} />
      <ListInfoMap entries={entries} />
      <Flex my={6} justifyContent="space-between" alignItems="center">
        <Like
          initalLikesCount={likes_count}
          initalIsLiked={isLiked}
          list_id={list.id}
        />
        <Text fontSize={{ base: "x-small", md: "sm" }} fontWeight="semibold">
          created {daysjs(list.created_at).fromNow()}
        </Text>
        <Box
          textAlign="center"
          _hover={{ opacity: 0.8, cursor: "pointer" }}
          transition="all cubic-bezier(0.4, 0, 0.2, 1) 300ms"
        >
          <Avatar
            size={{ base: "sm", md: "md" }}
            src={list.owner.image || undefined}
            name={list.owner.name || ""}
            mb={1}
          />
          <Text fontSize={{ base: "x-small", md: "sm" }}>
            {list.owner.name}
          </Text>
        </Box>
      </Flex>
      <PlacesList entries={entries} />
      <Box my={8} textAlign={{ base: "center", md: "start" }}>
        <Share name={list.name} />
      </Box>
    </Box>
  );
};

export default ListInfo;
