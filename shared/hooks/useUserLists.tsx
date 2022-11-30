import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { UserLists } from "shared/types";
import { useToast } from "@chakra-ui/react";

const getUserLists = async (uid: string, cursor_id: string | null) => {
  const { data } = await axios.get<UserLists>(`/api/user/${uid}/lists`, {
    params: {
      cursor_id,
    },
  });
  return data;
};

const useUserLists = (uid: string) => {
  const toast = useToast();

  return useInfiniteQuery({
    queryKey: ["user", "lists", uid],
    queryFn: ({ pageParam }) => getUserLists(uid, pageParam),
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

export default useUserLists;
