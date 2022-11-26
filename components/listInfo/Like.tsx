import { StarIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/react";
import useLike from "shared/hooks/useLike";
import { useState } from "react";

type Props = {
  initalLikesCount: number;
  initalIsLiked: boolean;
  list_id: string;
};

const Like = ({ initalLikesCount, initalIsLiked, list_id }: Props) => {
  const { status } = useSession();
  const { mutate, isLoading } = useLike();
  const [isLiked, setIsLiked] = useState<boolean>(initalIsLiked);
  const [likesCount, setLikesCount] = useState<number>(initalLikesCount);

  const likeHandler = () => {
    if (status === "authenticated") {
      mutate(list_id, {
        onSuccess: () => {
          setIsLiked((state) => !state);
          setLikesCount((state) => (isLiked ? state - 1 : state + 1));
        },
      });
    } else if (status === "unauthenticated") {
      signIn();
    }
  };

  return (
    <Button
      onClick={likeHandler}
      variant="ghost"
      leftIcon={<StarIcon color={isLiked ? "red.500" : "whiteAlpha.900"} />}
      isLoading={isLoading}
    >
      {likesCount}
    </Button>
  );
};

export default Like;
