import {
  Card,
  CardHeader,
  Heading,
  CardBody,
  Divider,
  CardFooter,
  Text,
  Link,
} from "@chakra-ui/react";
import { Entry } from "shared/types";
import { getDirectionsUrl } from "shared/utils";

type Props = {
  entry: Entry;
};

const PlaceCard = ({ entry }: Props) => {
  return (
    <Card>
      <CardHeader>
        <Heading size="sm">{entry.name}</Heading>
      </CardHeader>
      <CardBody>
        <Text fontSize="sm">{entry.description}</Text>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link
          color="blue.400"
          target="_blank"
          rel="noopener noreferrer"
          href={getDirectionsUrl(entry.lat, entry.lon, entry.place_id)}
        >
          Directions
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PlaceCard;
