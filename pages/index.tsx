import {
  Stack,
  Center,
  Heading,
  Text,
  Button,
  Flex,
  Link,
} from "@chakra-ui/react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  const clickHandler = () => {
    if (status === "authenticated") {
      router.push("/create");
    } else if (status === "unauthenticated") {
      signIn();
    }
  };

  return (
    <Flex h="100%" flexDir="column">
      <Center flex="1">
        <Stack textAlign="center" spacing={8}>
          <Heading>Hisuh</Heading>
          <Text fontSize="lg" fontWeight="semibold" fontFamily="mono">
            Create and Share Lists of your Favourite Places!
          </Text>
          <Button
            onClick={clickHandler}
            w="100%"
            colorScheme="facebook"
            isLoading={status === "loading"}
          >
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
