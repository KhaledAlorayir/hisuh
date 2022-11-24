import { Entry, MarkerItem } from "shared/types";
import {
  UnorderedList,
  ListItem,
  Box,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction } from "react";
import { FieldValues, UseFormReset, UseFormSetValue } from "react-hook-form";

type Props = {
  entries: Entry[];
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  setEditedEntry: Dispatch<SetStateAction<Entry | undefined>>;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
  setValue: UseFormSetValue<FieldValues>;
  editedEntry: Entry | undefined;
  reset: UseFormReset<FieldValues>;
};

const PlacesList = ({
  entries,
  setEntries,
  setEditedEntry,
  setMarker,
  setValue,
  editedEntry,
  reset,
}: Props) => {
  const toast = useToast();

  const deleteHandler = (date: number, name: string) => {
    setEntries((state) => state.filter(({ id }) => date !== id));
    toast({
      title: "place has been deleted",
      description: `${name} has been added to the list!`,
      status: "success",
      isClosable: true,
      duration: 8000,
    });

    if (editedEntry && editedEntry.id === date) {
      setMarker(undefined);
      setEditedEntry(undefined);
      reset();
    }
  };

  const editHandler = (entry: Entry) => {
    setEditedEntry(entry);
    setMarker({
      lat: entry.lat,
      lng: entry.lon,
    });
    setValue("name", entry.name);
    setValue("description", entry.description);
  };

  return (
    <>
      {entries.length > 0 && (
        <Box my={8}>
          <Text fontSize="xl" fontWeight="semibold" mb={2}>
            Added places:
          </Text>
          <UnorderedList spacing={{ base: 4, md: 2 }}>
            {entries.map((entry) => (
              <ListItem fontSize={{ base: "md", md: "lg" }} key={entry.id}>
                <Flex alignItems="center" gap="4">
                  <Text>{entry.name}</Text>
                  <DeleteIcon
                    onClick={() => deleteHandler(entry.id, entry.name)}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  />
                  <EditIcon
                    onClick={() => editHandler(entry)}
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  />
                </Flex>
              </ListItem>
            ))}
          </UnorderedList>
        </Box>
      )}
    </>
  );
};

export default PlacesList;
