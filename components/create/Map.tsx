import { GoogleMap, useJsApiLoader, MarkerF } from "@react-google-maps/api";
import { Box, CircularProgress, Center, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState, useRef } from "react";
import { MarkerItem } from "shared/types";
import useGetPlaceDetails from "shared/hooks/useGetPlaceDetails";
import { FieldValues, UseFormReset, UseFormSetValue } from "react-hook-form";
import Search from "./Search";
import { libraries } from "shared/consts";
import userLocationIcon from "public/me.svg";

type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
  setValue: UseFormSetValue<FieldValues>;
  center: google.maps.LatLngLiteral;
  setCenter: Dispatch<SetStateAction<google.maps.LatLngLiteral>>;
  reset: UseFormReset<FieldValues>;
};

const Map = ({
  marker,
  setMarker,
  setValue,
  center,
  setCenter,
  reset,
}: Props) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || "",
    libraries,
  });

  const { mutate } = useGetPlaceDetails();

  const mapRef = useRef<google.maps.Map>();
  const [initSearch, setInitSearch] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral>();

  const onMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCenter({ lat: latitude, lng: longitude });
        setUserLocation({ lat: latitude, lng: longitude });
        setInitSearch(true);
      },
      () => {
        setInitSearch(true);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  const clickHandler = (e: any) => {
    reset();
    console.log("clicked");
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
      {initSearch && (
        <Search mapRef={mapRef} setMarker={setMarker} setValue={setValue} />
      )}
      <Box h="50vh">
        <GoogleMap
          center={center}
          onLoad={onMapLoad}
          onClick={clickHandler}
          zoom={11}
          options={{ disableDefaultUI: true }}
          mapContainerStyle={{ height: "100%", width: "100%" }}
        >
          {marker && (
            <MarkerF position={{ lat: marker.lat, lng: marker.lng }} />
          )}
          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={{
                url: "/me.svg",
                scaledSize: new google.maps.Size(30, 30),
              }}
            />
          )}
        </GoogleMap>
      </Box>
    </Box>
  );
};

export default Map;
