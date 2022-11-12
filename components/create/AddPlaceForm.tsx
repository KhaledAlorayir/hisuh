import { Input, Box, Textarea, Button } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { MarkerItem } from "shared/types";

type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
};

const AddPlaceForm = ({ marker }: Props) => {
  return (
    <Box>
      {marker && (
        <form>
          <Input placeholder="place name" mb={4} />
          <Textarea placeholder="place description" resize="none" mb={4} />
          <Button variant="outline" type="submit">
            Add Place
          </Button>
        </form>
      )}
    </Box>
  );
};

export default AddPlaceForm;
