import React, { Dispatch, SetStateAction } from "react";
import { Box, Center, CircularProgress, Text } from "@chakra-ui/react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  InfoWindow,
  InfoWindowF,
} from "@react-google-maps/api";
import { Entry } from "shared/types";
import { ListInfo } from "shared/types";

type Props = {
  entries: Entry[];
  listInfo: ListInfo | undefined;
  setEntries: Dispatch<SetStateAction<Entry[]>>;
};

const Conformation = ({ entries, listInfo, setEntries }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });
  if (!isLoaded) {
    return (
      <Center h="100%">
        <CircularProgress isIndeterminate />
      </Center>
    );
  }
  if (loadError) {
    return (
      <Center h="100%">
        <Text fontSize="xl">an error has occurred</Text>
      </Center>
    );
  }

  return (
    <>
      {entries && listInfo && (
        <Box py={4}>
          <Text mb={4} fontSize="lg" fontWeight="bold" textAlign="center">
            {listInfo.name}
          </Text>
          {listInfo.description && (
            <Text
              color="whiteAlpha.800"
              mb={4}
              fontSize="sm"
              fontWeight="semibold"
              textAlign="center"
            >
              {listInfo.description}
            </Text>
          )}
          <Box h="50vh">
            <GoogleMap
              zoom={10}
              options={{ disableDefaultUI: true, clickableIcons: false }}
              center={{
                lat: entries[0].lat,
                lng: entries[0].lon,
              }}
              mapContainerStyle={{ height: "100%", width: "100%" }}
            >
              {entries.map(({ addedDate, lat, lon, name, description }) => (
                <MarkerF
                  title={name}
                  key={addedDate}
                  position={{ lat, lng: lon }}
                />
              ))}
              <InfoWindow
                options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                position={{ lat: entries[0].lat, lng: entries[0].lon }}
              >
                <Box h="20vh" w="20vw" textAlign="center" bgColor="red">
                  <Text textColor="black">this is a placeasddddddsadsdas</Text>
                </Box>
              </InfoWindow>
            </GoogleMap>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Conformation;
