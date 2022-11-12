import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Box, CircularProgress, Center, Text } from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { MarkerItem } from "shared/types";
import useGetPlaceDetails from "shared/hooks/useGetPlaceDetails";
type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
};

const Map = ({ marker, setMarker }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
  });

  const [location, setLocation] = useState<MarkerItem>();
  const { mutate } = useGetPlaceDetails();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setLocation({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  const clickHandler = (e: any) => {
    if (e.placeId) {
      mutate(e.placeId, {
        onSuccess: (res) => {
          setMarker({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
            name: res.name,
          });
        },
        onError: () => {
          setMarker({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
          });
        },
      });
    } else {
      setMarker({ lat: e.latLng?.lat() || 0, lng: e.latLng?.lng() || 0 });
    }
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
    <Box height="60%" py={8}>
      <GoogleMap
        onClick={clickHandler}
        zoom={10}
        options={{ disableDefaultUI: true }}
        center={{
          lat: location?.lat || 24.774344,
          lng: location?.lng || 46.743713,
        }}
        mapContainerStyle={{ height: "100%", width: "100%" }}
      >
        {marker && <Marker position={{ lat: marker.lat, lng: marker.lng }} />}
      </GoogleMap>
    </Box>
  );
};

export default Map;
