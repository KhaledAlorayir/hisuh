import { Box, Button, Flex, Text, Center, Heading } from "@chakra-ui/react";
import { Entry } from "shared/types";
import { ListInfo } from "shared/types";
import ListInfoMap from "components/ListInfoMap";
import useCreateList from "shared/hooks/useCreateList";
import useUpdateList from "shared/hooks/useUpdateList";
import { Dispatch, SetStateAction } from "react";
import Link from "next/link";
import ListInfoTitle from "components/ListInfoTitle";
import Share from "components/Share";
import PlacesList from "components/PlacesList";

type Props = {
  entries: Entry[];
  listInfo: ListInfo | undefined;
  setShowControls: Dispatch<SetStateAction<boolean>>;
  isEdit?: boolean;
  listId?: string;
};

const Conformation = ({
  entries,
  listInfo,
  setShowControls,
  isEdit,
  listId,
}: Props) => {
  const {
    mutate: create,
    isLoading: Cisloading,
    isSuccess: CisSuccess,
    data: cData,
  } = useCreateList();
  const {
    mutate: update,
    isLoading: Uisloading,
    isSuccess: UisSuccess,
    data: uData,
  } = useUpdateList();

  const data = isEdit ? uData : cData;
  const isSuccess = isEdit ? UisSuccess : CisSuccess;
  const isLoading = isEdit ? Uisloading : Cisloading;

  const submitHandler = () => {
    if (listInfo) {
      setShowControls(false);
      if (isEdit && listId) {
        update(
          { entries_info: entries, list_info: listInfo, listId },
          {
            onError: () => {
              setShowControls(true);
            },
          }
        );
      } else {
        create(
          { entries_info: entries, list_info: listInfo },
          {
            onError: () => {
              setShowControls(true);
            },
          }
        );
      }
    }
  };

  if (isSuccess && data) {
    return (
      <Center height="100%">
        <Box textAlign="center">
          <Heading as="h3" size="lg" mb={4}>
            List has been {isEdit ? "updated!" : "created!"} 🥳
          </Heading>

          <Link href={`https://hisuh.vercel.app/list/${data.id}`}>
            https://hisuh.vercel.app/list/{data.id}
          </Link>
          <Box mt={4}>
            {listInfo && (
              <Share
                name={listInfo.name}
                url={`https://hisuh.vercel.app/list/${data.id}`}
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
              loadingText={
                isEdit ? "updating the list..." : "creating the list..."
              }
            >
              {isEdit ? "Update List!" : "Create List!"}
            </Button>
          </Flex>
        </Box>
      )}
    </>
  );
};

export default Conformation;
