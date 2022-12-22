import {
  Stack,
  Center,
  Heading,
  Text,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Home() {
  return (
    <Flex h="100%" flexDir="column">
      <Center flex="1">
        <Stack textAlign="center" spacing={8}>
          <Heading>Hisuh</Heading>
          <Text fontSize="lg" fontWeight="semibold" fontFamily="mono">
            Create and Share Lists of your Favourite Places!
          </Text>
          <Button w="100%" colorScheme="facebook" as={NextLink} href="/create">
            Try it 🙌
          </Button>
        </Stack>
      </Center>
      <Text textAlign="center" py={2}>
        Made by{" "}
        <Link
          color="blue.400"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/KhaledAlorayir"
        >
          Khaled Alorayir
        </Link>
      </Text>
    </Flex>
  );
}
