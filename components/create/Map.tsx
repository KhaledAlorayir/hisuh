import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Box, CircularProgress, Center, Text } from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useState,
  useRef,
  LegacyRef,
  MutableRefObject,
} from "react";
import { MarkerItem, MapsLibrary } from "shared/types";
import useGetPlaceDetails from "shared/hooks/useGetPlaceDetails";
import { FieldValues, UseFormSetValue } from "react-hook-form";
import Search from "./Search";
type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
  setValue: UseFormSetValue<FieldValues>;
};

const libraries: MapsLibrary = ["places"];

const Map = ({ marker, setMarker, setValue }: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries,
  });

  const { mutate } = useGetPlaceDetails();
  const [latLng, setLatLng] = useState<MarkerItem>({
    lat: 24.774265,
    lng: 46.738586,
  });
  const mapRef = useRef<google.maps.Map>();

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        map.setCenter({ lat: latitude, lng: longitude });
        setLatLng({ lat: latitude, lng: longitude });
      },
      () => {
        map.setCenter({ lat: 24.774265, lng: 46.738586 });
      }
    );
  };

  const clickHandler = (e: any) => {
    if (e.placeId) {
      mutate(e.placeId, {
        onSuccess: (res) => {
          setMarker({
            lat: e.latLng?.lat() || 0,
            lng: e.latLng?.lng() || 0,
            place_id: e.placeId,
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
      {mapRef.current && <Search latLng={latLng} mapRef={mapRef} />}
      <Box h="50vh">
        <GoogleMap
          onLoad={onMapLoad}
          onClick={clickHandler}
          zoom={11}
          options={{ disableDefaultUI: true }}
          mapContainerStyle={{ height: "100%", width: "100%" }}
        >
          {marker && (
            <MarkerF position={{ lat: marker.lat, lng: marker.lng }} />
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default Map;
