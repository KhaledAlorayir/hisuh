import { Box, Button, Flex, Text, Center, Heading } from "@chakra-ui/react";
import { Entry } from "shared/types";
import { ListInfo } from "shared/types";
import ListInfoMap from "components/ListInfoMap";
import useCreateList from "shared/hooks/useCreateList";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import ListInfoTitle from "components/ListInfoTitle";
import Share from "components/Share";
import PlacesList from "components/PlacesList";

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

          <Link href={`http://localhost:3000/list/${data.id}`}>
            http://localhost:3000/list/{data.id}
          </Link>
          <Box mt={4}>
            {listInfo && (
              <Share
                name={listInfo.name}
                url={`http://localhost:3000/list/${data.id}`}
              />
            )}
          </Box>
        </Box>
      </Center>
    );
  }

  return (
    <>
      {entries && listInfo && (
        <Box py={4}>
          <ListInfoTitle
            name={listInfo.name}
            description={listInfo.description}
          />
          <ListInfoMap entries={entries} />
          <Box my={8}>
            <PlacesList entries={entries} />
          </Box>
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
