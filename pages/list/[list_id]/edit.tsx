import { Box } from "@chakra-ui/react";
import AddPlaceForm from "components/create/AddPlaceForm";
import Map from "components/create/Map";
import { useState } from "react";
import { Entry, ListInfo, MarkerItem } from "shared/types";
import { useForm } from "react-hook-form";
import ListInfoForm from "components/create/ListInfoForm";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import PlacesListEdit from "components/create/PlacesListEdit";
import Conformation from "components/create/Conformation";
import Controls from "components/create/Controls";
import { useAtom } from "jotai";
import { ActivePlace } from "shared/atoms";
import prisma from "shared/prisma";
import { ListIdParamsSchema } from "shared/schemas";

type Props = {
  listInfo: ListInfo;
  entries: Entry[];
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req,
  res,
  query,
}) => {
  const params = ListIdParamsSchema.safeParse(query);

  if (!params.success) {
    return {
      notFound: true,
    };
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const list = await prisma.list.findUnique({
    where: {
      id: params.data.list_id,
    },
    include: {
      entries: {
        include: {
          spot: true,
        },
      },
    },
  });

  if (!list || list.owner_id !== session.uid) {
    return {
      notFound: true,
    };
  }

  const entries: Entry[] = list.entries.map(
    ({ id, spot: { lat, lon, place_id }, name, description }) => ({
      id,
      lat,
      lon,
      name,
      description: description,
      place_id: place_id,
    })
  );

  return {
    props: {
      entries,
      listInfo: { name: list.name, description: list.description || "" },
    },
  };
};

const edit = (props: Props) => {
  const [marker, setMarker] = useState<MarkerItem>();
  const [entries, setEntries] = useState<Entry[]>(props.entries);
  const [listInfo, setListInfo] = useState<ListInfo>();
  const [editedEntry, setEditedEntry] = useState<Entry>();
  const [isConformation, setIsConformation] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 24.774265,
    lng: 46.738586,
  });
  const [activePlace, setActivePlace] = useAtom(ActivePlace);

  const {
    register: placeRegister,
    handleSubmit: placeHandleSubmit,
    setValue: placeSetValue,
    reset: placeReset,
    formState: { errors: placeErrors, isValid: placeIsValid },
  } = useForm({
    mode: "onTouched",
  });

  const {
    register: listRegister,
    handleSubmit: listHandleSubmit,
    formState: { errors: listErrors },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      name: props.listInfo.name,
      description: props.listInfo.description,
    },
  });

  if (!listInfo) {
    return (
      <ListInfoForm
        register={listRegister}
        handleSubmit={listHandleSubmit}
        errors={listErrors}
        setListInfo={setListInfo}
      />
    );
  }

  if (isConformation) {
    return (
      <Box h="100%">
        <Controls
          leftShown={showControls}
          rightShown={false}
          leftText="edit places"
          leftAction={() => {
            setIsConformation(false);
            if (activePlace) {
              setActivePlace(null);
            }
          }}
        />
        <Conformation
          entries={entries}
          listInfo={listInfo}
          setShowControls={setShowControls}
        />
      </Box>
    );
  }

  return (
    <Box h="100%">
      <Controls
        leftShown={true}
        rightShown={entries.length > 0}
        leftText="edit list info"
        rightText="next"
        leftAction={() => {
          setListInfo(undefined);
        }}
        rightAction={() => {
          setIsConformation(true);
        }}
      />
      <Map
        reset={placeReset}
        setValue={placeSetValue}
        marker={marker}
        setMarker={setMarker}
        center={center}
        setCenter={setCenter}
      />
      <AddPlaceForm
        entries={entries}
        setEntries={setEntries}
        isValid={placeIsValid}
        register={placeRegister}
        handleSubmit={placeHandleSubmit}
        marker={marker}
        setMarker={setMarker}
        errors={placeErrors}
        reset={placeReset}
        editedEntry={editedEntry}
        setEditedEntry={setEditedEntry}
      />
      <PlacesListEdit
        entries={entries}
        setEntries={setEntries}
        setEditedEntry={setEditedEntry}
        setMarker={setMarker}
        setValue={placeSetValue}
        editedEntry={editedEntry}
        reset={placeReset}
        setCenter={setCenter}
      />
    </Box>
  );
};

export default edit;
