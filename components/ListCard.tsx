import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  Text,
} from "@chakra-ui/react";
import { List } from "@prisma/client";
import daysjs from "dayjs";
import rt from "dayjs/plugin/relativeTime";
import Link from "next/link";
daysjs.extend(rt);

type Props = {
  list: List;
};

const ListCard = ({ list: { name, id, created_at } }: Props) => {
  return (
    <Card>
      <CardHeader>
        <Link href={`/list/${id}`}>
          <Heading size="sm">{name}</Heading>
        </Link>
      </CardHeader>
      <Divider />
      <CardBody>
        <Text fontSize="sm"> created {daysjs(created_at).fromNow()}</Text>
      </CardBody>
    </Card>
  );
};

export default ListCard;
