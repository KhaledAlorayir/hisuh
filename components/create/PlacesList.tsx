import { Entry } from "shared/types";
import { UnorderedList, ListItem, Box, Text } from "@chakra-ui/react";

type Props = {
  entries: Entry[];
};

const PlacesList = ({ entries }: Props) => {
  return (
    <>
      {entries.length > 0 && (
        <Box my={4}>
          <Text fontSize="lg" fontWeight="semibold" mb={2}>
            Added places:
          </Text>
          <UnorderedList spacing={2}>
            {entries.map(({ name }) => (
              <ListItem>{name}</ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </>
  );
};

export default PlacesList;
