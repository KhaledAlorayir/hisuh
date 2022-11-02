import { Flex, Heading, Button } from "@chakra-ui/react";

type Props = {};

const NavBar = (props: Props) => {
  return (
    <Flex
      bg="whiteAlpha.50"
      justifyContent="space-between"
      alignItems="center"
      px={8}
      py={6}
    >
      <Heading>Hisuh</Heading>
      <Button>Login</Button>
    </Flex>
  );
};

export default NavBar;
