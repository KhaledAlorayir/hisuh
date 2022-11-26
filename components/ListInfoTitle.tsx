import { Box, Text } from "@chakra-ui/react";
type Props = {
  name: string;
  description: string | null | undefined;
};

const ListInfoTitle = ({ name, description }: Props) => {
  return (
    <Box mb={4}>
      <Text
        fontSize="xl"
        fontWeight="bold"
        textAlign="center"
        fontFamily="mono"
      >
        {name}
      </Text>
      {description && (
        <Text
          color="whiteAlpha.800"
          fontSize="sm"
          fontWeight="semibold"
          textAlign="center"
        >
          {description}
        </Text>
      )}
    </Box>
  );
};

export default ListInfoTitle;
