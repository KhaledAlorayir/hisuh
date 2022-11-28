import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

type Props = {
  name: string;
  url?: string;
};

const Share = ({ name, url }: Props) => {
  const router = useRouter();
  const toast = useToast();

  const shareHandler = () => {
    if (!!navigator.share) {
      navigator.share({
        title: "share this list!",
        text: name,
        url: url || router.asPath,
      });
    } else {
      navigator.clipboard.writeText(url || router.asPath);
      toast({
        title: "link has been copied!",
        isClosable: true,
        status: "success",
        duration: 2000,
      });
    }
  };

  return (
    <Button
      onClick={shareHandler}
      variant="outline"
      colorScheme="messenger"
      size="sm"
    >
      Share list!
    </Button>
  );
};

export default Share;
