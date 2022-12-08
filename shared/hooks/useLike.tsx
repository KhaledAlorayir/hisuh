import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { APIError } from "shared/types";
import { useToast } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const like = (list_id: string) => {
  return axios.post(`/api/like/${list_id}`);
};

const useLike = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, status } = useSession();

  return useMutation<unknown, APIError, string>({
    mutationFn: like,
    onError: () => {
      toast({
        title: "an error has occurred",
        status: "error",
        isClosable: true,
        duration: 8000,
      });
    },
    onSuccess: () => {
      if (status === "authenticated") {
        queryClient.invalidateQueries(["user", "likes", data.uid]);
      }
    },
  });
};

export default useLike;
