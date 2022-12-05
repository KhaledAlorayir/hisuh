import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError, Entry, ListInfo } from "shared/types";
import { ListBodySchema } from "shared/schemas";
import { List } from "@prisma/client";
import { useToast } from "@chakra-ui/react";

const updateList = async ({
  entries_info,
  list_info,
  listId,
}: {
  entries_info: Entry[];
  list_info: ListInfo;
  listId: string;
}) => {
  const entries = entries_info.map(
    ({ lat, lon, name, description, place_id }) => ({
      name,
      lat,
      lon,
      description:
        description && description.length > 0 ? description : undefined,
      place_id,
    })
  );

  list_info.description =
    list_info.description && list_info.description.length > 0
      ? list_info.description
      : undefined;

  const body = {
    ...list_info,
    entries,
  };

  const validated = ListBodySchema.safeParse(body);

  if (!validated.success) {
    throw new Error("validation error");
  }
  const res = await axios.patch(`/api/list/${listId}`, validated.data);
  return res.data;
};

const useUpdateList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    List,
    APIError,
    { entries_info: Entry[]; list_info: ListInfo; listId: string }
  >({
    mutationFn: updateList,
    onError: () => {
      toast({
        title: "an error has occurred",
        description: `please make sure that all information are provided or try later!`,
        status: "error",
        isClosable: true,
        duration: 8000,
      });
    },
    onSuccess: ({ owner_id }) => {
      queryClient.invalidateQueries(["user", "lists", owner_id]);
    },
  });
};

export default useUpdateList;
