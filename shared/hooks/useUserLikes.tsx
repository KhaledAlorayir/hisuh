import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ListsPagenation } from "shared/types";
import { useToast } from "@chakra-ui/react";

const getUserLikes = async (uid: string, cursor_id: string | null) => {
  const { data } = await axios.get<ListsPagenation>(`/api/user/${uid}/likes`, {
    params: {
      cursor_id,
    },
  });
  return data;
};

const useUserLikes = (uid: string) => {
  const toast = useToast();

  return useInfiniteQuery({
    queryKey: ["user", "likes", uid],
    queryFn: ({ pageParam }) => getUserLikes(uid, pageParam),
    getNextPageParam: ({ lists, has_next }) => {
      if (has_next) {
        return lists[lists.length - 1].id;
      }
      return undefined;
    },
    onError: () => {
      toast({
        title: "an error has occurred",
        status: "error",
        isClosable: true,
        duration: 8000,
      });
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

export default useUserLikes;
