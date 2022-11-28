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
import { ActivePlace } from "shared/atoms";
import { useAtom } from "jotai";

type Props = {
  entry: Entry;
};

const PlaceCard = ({ entry }: Props) => {
  const [activePlace, setActivePlace] = useAtom(ActivePlace);

  const activateHandler = () => {
    setActivePlace(entry.id);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <Card variant={activePlace === entry.id ? "outline" : "filled"}>
      <CardHeader _hover={{ cursor: "pointer" }} onClick={activateHandler}>
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
