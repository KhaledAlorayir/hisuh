import axios from "axios";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { APIError, UserLists } from "shared/types";
import { useToast } from "@chakra-ui/react";
import { List } from "@prisma/client";

const deleteList = async (list_id: string) => {
  return axios.delete<List>(`/api/list/${list_id}`);
};

const useDeleteList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteList,
    onError: (e) => {
      console.log(e);
      toast({
        title: "an error has occurred",
        status: "error",
        isClosable: true,
        duration: 8000,
      });
    },
    onSuccess: ({ data: { owner_id, id: listId } }) => {
      queryClient.setQueryData(
        ["user", "lists", owner_id],
        (data: InfiniteData<UserLists> | undefined) => {
          if (data) {
            return {
              ...data,
              pages: data.pages.map(({ lists, has_next }) => {
                let updated = lists.filter(({ id }) => id !== listId);
                return { has_next, lists: updated };
              }),
            };
          }
          return data;
        }
      );

      toast({
        title: "list has been deleted!",
        status: "success",
        isClosable: true,
        duration: 8000,
      });
    },
  });
};

export default useDeleteList;
