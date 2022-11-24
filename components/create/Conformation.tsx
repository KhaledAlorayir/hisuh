import { Box, Button, Flex, Text, Center, Heading } from "@chakra-ui/react";
import { Entry } from "shared/types";
import { ListInfo } from "shared/types";
import ListInfoMap from "components/ListInfoMap";
import useCreateList from "shared/hooks/useCreateList";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";

type Props = {
  entries: Entry[];
  listInfo: ListInfo | undefined;
  setShowControls: Dispatch<SetStateAction<boolean>>;
};

const Conformation = ({ entries, listInfo, setShowControls }: Props) => {
  const { mutate, isLoading, isSuccess, data } = useCreateList();

  const submitHandler = () => {
    if (listInfo) {
      setShowControls(false);
      mutate(
        { entries_info: entries, list_info: listInfo },
        {
          onError: () => {
            setShowControls(true);
          },
        }
      );
    }
  };

  if (isSuccess) {
    return (
      <Center height="100%">
        <Box textAlign="center">
          <Heading as="h3" size="lg" mb={4}>
            List has been created!🥳
          </Heading>
          <Text fontWeight="semibold" mb={4}>
            use this link to share the list
          </Text>
          <Link href="#">domain.com/list/{data.id}</Link>
        </Box>
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
          <ListInfoMap entries={entries} />
          <Flex my={8} justifyContent="flex-end">
            <Button
              w={{ base: "100%", md: "auto" }}
              colorScheme="messenger"
              onClick={submitHandler}
              isLoading={isLoading}
              loadingText="creating the list..."
            >
              Create List!
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Conformation;
