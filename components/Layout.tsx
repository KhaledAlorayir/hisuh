import { Flex, Container } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import NavBar from "./NavBar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flex flexDir="column" height="100vh">
      <NavBar />
      <Container maxW="container.xl" flex={1}>
        {children}
      </Container>
    </Flex>
  );
};

export default Layout;
