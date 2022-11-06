import { Flex, Heading, Button } from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";

type Props = {};

const NavBar = (props: Props) => {
  const { data, status } = useSession();

  return (
    <Flex
      bg="whiteAlpha.50"
      justifyContent="space-between"
      alignItems="center"
      px={8}
      py={6}
    >
      <Heading>Hisuh</Heading>
      {status === "unauthenticated" ? (
        <Button onClick={() => signIn()}>Login</Button>
      ) : (
        <Button onClick={() => signOut()}>Logout</Button>
      )}
    </Flex>
  );
};

export default NavBar;
