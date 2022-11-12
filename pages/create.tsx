type Props = {};
import { Box } from "@chakra-ui/react";
import AddPlaceForm from "components/create/AddPlaceForm";
import Map from "components/create/Map";
import { useState } from "react";
import { MarkerItem } from "shared/types";

const create = (props: Props) => {
  const [marker, setMarker] = useState<MarkerItem>();

  return (
    <Box h="100%">
      <Map marker={marker} setMarker={setMarker} />
      <AddPlaceForm marker={marker} setMarker={setMarker} />
    </Box>
  );
};

export default create;
