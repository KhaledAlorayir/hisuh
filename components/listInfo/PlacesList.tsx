import { Entry } from "shared/types";
import { Box, Heading } from "@chakra-ui/react";
import { SimpleGrid } from "@chakra-ui/react";
import PlaceCard from "components/listInfo/PlaceCard";

type Props = {
  entries: Entry[];
};

const PlacesList = ({ entries }: Props) => {
  return (
    <Box>
      <Heading size="md" mb={4}>
        Places:
      </Heading>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
        {entries.map((entry) => (
          <PlaceCard entry={entry} key={entry.id} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default PlacesList;
