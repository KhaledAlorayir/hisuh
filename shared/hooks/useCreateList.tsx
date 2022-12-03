import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIError, Entry, ListInfo } from "shared/types";
import { ListBodySchema } from "shared/schemas";
import { List } from "@prisma/client";
import { useToast } from "@chakra-ui/react";

const createList = async ({
  entries_info,
  list_info,
}: {
  entries_info: Entry[];
  list_info: ListInfo;
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
  const res = await axios.post("/api/list", validated.data);
  return res.data;
};

const useCreateList = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation<
    List,
    APIError,
    { entries_info: Entry[]; list_info: ListInfo }
  >({
    mutationFn: createList,
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

export default useCreateList;
