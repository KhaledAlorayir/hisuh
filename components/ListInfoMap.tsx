import { Box, Center, CircularProgress, Text, Link } from "@chakra-ui/react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useState } from "react";
import { Entry } from "shared/types";
import { getDirectionsUrl } from "shared/utils";
import { libraries } from "shared/consts";

type Props = {
  entries: Entry[];
};

const ListInfo = ({ entries }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries,
  });

  const [active, setActive] = useState<number>(-1);

  const onMapLoad = (map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    entries.forEach((e) => bounds.extend({ lat: e.lat, lng: e.lon }));
    map.fitBounds(bounds);
  };

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
    <Box h="50vh">
      <GoogleMap
        zoom={10}
        onLoad={onMapLoad}
        options={{ disableDefaultUI: true, clickableIcons: false }}
        /*         center={{
          lat: entries[0].lat,
          lng: entries[0].lon,
        }} */
        mapContainerStyle={{ height: "100%", width: "100%" }}
      >
        {entries.map((e) => (
          <MarkerF
            onClick={() => {
              setActive(e.id);
            }}
            title={e.name}
            key={e.id}
            position={{ lat: e.lat, lng: e.lon }}
          >
            {active === e.id && (
              <InfoWindowF onCloseClick={() => setActive(-1)}>
                <Box h="vh" p={4} textAlign="center">
                  <Text textColor="black" mb={2}>
                    {e.name}
                  </Text>
                  {e.description && (
                    <Text fontSize="sm" color="blackAlpha.800">
                      '{e.description}'
                    </Text>
                  )}
                  <Link
                    color="blue.400"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getDirectionsUrl(e)}
                  >
                    directions
                  </Link>
                </Box>
              </InfoWindowF>
            )}
          </MarkerF>
        ))}
      </GoogleMap>
    </Box>
  );
};

export default ListInfo;
