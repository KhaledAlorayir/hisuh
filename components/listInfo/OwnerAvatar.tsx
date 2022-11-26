import { Avatar, Box, list, Text } from "@chakra-ui/react";

type Props = {
  name: string | null;
  image: string | null;
};

const OwnerAvatar = ({ image, name }: Props) => {
  return (
    <Box
      textAlign="center"
      _hover={{ opacity: 0.8, cursor: "pointer" }}
      transition="all cubic-bezier(0.4, 0, 0.2, 1) 300ms"
    >
      <Avatar size="md" src={image || undefined} name={name || ""} mb={1} />
      <Text fontSize="smaller">{name}</Text>
    </Box>
  );
};

export default OwnerAvatar;
