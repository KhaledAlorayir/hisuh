import {
  Flex,
  Heading,
  Button,
  Avatar,
  Spinner,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
} from "@chakra-ui/react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
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
      <Heading>
        <Link href="/">Hisuh</Link>
      </Heading>
      {status === "unauthenticated" ? (
        <Button onClick={() => signIn()}>Login</Button>
      ) : status === "authenticated" ? (
        <Flex alignItems="center" gap={4}>
          <Menu>
            <MenuButton>
              <Avatar
                src={data.user?.image || undefined}
                name={data.user?.name || ""}
              />
            </MenuButton>
            <MenuList>
              <Link href="/create">
                <MenuItem>Create a list</MenuItem>
              </Link>
              <MenuItem onClick={() => signOut()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      ) : (
        <Spinner />
      )}
    </Flex>
  );
};

export default NavBar;
