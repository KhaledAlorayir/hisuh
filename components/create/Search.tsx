import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { Box, Input, useToast } from "@chakra-ui/react";
import usePlaces, { getGeocode, getLatLng } from "use-places-autocomplete";
import { MarkerItem } from "shared/types";
import { ChangeEvent, MutableRefObject } from "react";

type Props = {
  latLng: MarkerItem;
  mapRef: MutableRefObject<google.maps.Map | undefined>;
};

const Search = ({ latLng, mapRef }: Props) => {
  const center = mapRef.current!.getCenter();
  const {
    ready,
    value,
    setValue,
    suggestions: { data, loading, status },
    clearSuggestions,
  } = usePlaces({
    requestOptions: {
      location: {
        lat: center!.lat,
        lng: center!.lng,
        equals: center!.equals,
        toJSON: center!.toJSON,
        toString: center!.toString,
        toUrlValue: center!.toUrlValue,
      },
      radius: 300 * 1000,
      componentRestrictions: {
        country: "SA",
      },
    },
  });

  // get country && set marker ??

  const toast = useToast();

  const selectHandler = async (id: string) => {
    const place = data.find(({ place_id }) => id === place_id);

    if (place && mapRef.current) {
      setValue(place.structured_formatting.main_text, false);
      clearSuggestions();
      try {
        const address = await getGeocode({ address: place.description });
        const { lat, lng } = getLatLng(address[0]);
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      } catch (error) {
        toast({
          duration: 5000,
          title: "an error occurred",
          isClosable: true,
          status: "error",
        });
      }
    }
  };

  return (
    <Box my={4}>
      <Combobox onSelect={selectHandler}>
        <ComboboxInput
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
          disabled={!ready}
          placeholder="search places!"
          autocomplete={false}
          as={Input}
        />
        <ComboboxPopover style={{ backgroundColor: "#1A202C" }}>
          {status === "OK" && (
            <ComboboxList>
              {data.map((res) => (
                <ComboboxOption value={res.place_id} key={res.place_id}>
                  {res.structured_formatting.main_text}
                </ComboboxOption>
              ))}
            </ComboboxList>
          )}
        </ComboboxPopover>
      </Combobox>
    </Box>
  );
};

export default Search;
