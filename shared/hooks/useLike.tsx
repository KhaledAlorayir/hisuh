import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { APIError } from "shared/types";
import { useToast } from "@chakra-ui/react";

const like = (list_id: string) => {
  return axios.post(`/api/like/${list_id}`);
};

const useLike = () => {
  const toast = useToast();

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
  });
};

export default useLike;
