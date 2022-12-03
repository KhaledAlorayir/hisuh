import { Box, Button, SimpleGrid, Spinner, Text } from "@chakra-ui/react";
import { List } from "@prisma/client";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { UserLists } from "shared/types";
import { text } from "stream/consumers";
import ListCard from "./ListCard";

type Props = {
  lists: List[] | undefined;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<UserLists, unknown>>;
  hasNextPage: boolean | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isSuccess: boolean;
  text: string;
};

const Lists = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isSuccess,
  lists,
  text,
}: Props) => {
  if (isLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <>
      {lists && isSuccess && (
        <Box>
          <Text fontSize="lg" fontWeight="semibold">
            {text} :
          </Text>
          {lists.length === 0 ? (
            <Text my={2}>no lists found!</Text>
          ) : (
            <>
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
                spacing={5}
                my={6}
              >
                {lists.map((l) => (
                  <ListCard list={l} key={l.id} />
                ))}
              </SimpleGrid>
              {hasNextPage && (
                <Box textAlign={{ base: "center", md: "start" }}>
                  <Button
                    variant="outline"
                    colorScheme="messenger"
                    isLoading={isFetchingNextPage}
                    onClick={() => fetchNextPage()}
                  >
                    Load more
                  </Button>
                </Box>
              )}
            </>
          )}
        </Box>
      )}
    </>
  );
};

export default Lists;
