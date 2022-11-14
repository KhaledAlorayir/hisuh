import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { Box, CircularProgress, Center, Text, Button } from "@chakra-ui/react";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { ListInfo, MarkerItem } from "shared/types";
import useGetPlaceDetails from "shared/hooks/useGetPlaceDetails";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import { ArrowBackIcon } from "@chakra-ui/icons";
type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
  setValue: UseFormSetValue<FieldValues>;
};

const Map = ({ marker, setMarker, setValue }: Props) => {
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
    console.log(e);
    if (e.placeId) {
      mutate(e.placeId, {
        onSuccess: (res) => {
          setMarker({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
          });
          setValue("name", res.name);
        },
        onError: () => {
          setMarker({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
          });
        },
      });
    } else {
      console.log(marker);
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
    <Box py={4}>
      <Text mb={4} fontSize="lg" fontWeight="bold" textAlign="center">
        choose a place from the map to add it
      </Text>
      <Box h="50vh">
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
    </Box>
  );
};

export default Map;
