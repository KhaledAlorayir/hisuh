import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { List } from "@prisma/client";
import daysjs from "dayjs";
import rt from "dayjs/plugin/relativeTime";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useDeleteList from "shared/hooks/useDeleteList";

daysjs.extend(rt);

type Props = {
  list: List;
};

const ListCard = ({ list: { name, id, created_at, owner_id } }: Props) => {
  const { data } = useSession();
  const { mutate, isLoading } = useDeleteList();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteHandler = () => {
    mutate(id, {
      onSuccess: onClose,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Link href={`/list/${id}`}>
            <Heading size="sm">{name}</Heading>
          </Link>
        </CardHeader>
        <Divider />
        <CardBody>
          <Text fontSize="sm">created {daysjs(created_at).fromNow()}</Text>
        </CardBody>
        {data && data.uid === owner_id && (
          <CardFooter>
            <Button
              leftIcon={<DeleteIcon />}
              size={{ base: "sm", md: "xs" }}
              variant="outline"
              colorScheme="red"
              onClick={onOpen}
            >
              Delete
            </Button>
          </CardFooter>
        )}
      </Card>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete List</ModalHeader>
          <ModalBody>are you sure you want to delete the list?</ModalBody>
          <ModalFooter gap="4">
            <Button
              onClick={deleteHandler}
              colorScheme="red"
              size="sm"
              variant="ghost"
              isLoading={isLoading}
            >
              Delete
            </Button>
            <Button onClick={onClose} size="sm" variant="ghost">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListCard;
