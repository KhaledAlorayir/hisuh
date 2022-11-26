import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { ListIdParamsSchema } from "shared/schemas";
import prisma from "shared/prisma";
import { Entry, ParsedList } from "shared/types";
import ListInfoMap from "components/ListInfoMap";
import { Box, Flex } from "@chakra-ui/react";
import ListInfoTitle from "components/ListInfoTitle";
import OwnerAvatar from "components/listInfo/OwnerAvatar";
import Like from "components/listInfo/Like";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

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

  Migrate db to supabasee

  1- compelete this
    - place list cards
  2- bookmarks list
  3- users page showing there lists
  4- ud lists
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
        <OwnerAvatar image={list.owner.image} name={list.owner.name} />
      </Flex>
    </Box>
  );
};

export default ListInfo;
