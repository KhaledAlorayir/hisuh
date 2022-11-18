import { Box, Button, Flex } from "@chakra-ui/react";
import AddPlaceForm from "components/create/AddPlaceForm";
import Map from "components/create/Map";
import { useState } from "react";
import { Entry, ListInfo, MarkerItem } from "shared/types";
import { useForm } from "react-hook-form";
import ListInfoForm from "components/create/ListInfoForm";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { ArrowBackIcon } from "@chakra-ui/icons";
import PlacesList from "components/create/PlacesList";
import Conformation from "components/create/Conformation";
import Controls from "components/create/Controls";

type Props = {};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const create = (props: Props) => {
  const [marker, setMarker] = useState<MarkerItem>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [listInfo, setListInfo] = useState<ListInfo>();
  const [editedEntry, setEditedEntry] = useState<Entry>();
  const [isConformation, setIsConformation] = useState<boolean>(false);

  /*
    4- conformaition page
      - replace useeffect with onload
      - bounds
    3- search
  */
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
          leftShown={true}
          rightShown={false}
          leftText="edit places"
          leftAction={() => setIsConformation(false)}
        />
        <Conformation
          entries={entries}
          listInfo={listInfo}
          setEntries={setEntries}
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
      <Map setValue={placeSetValue} marker={marker} setMarker={setMarker} />
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
      <PlacesList
        entries={entries}
        setEntries={setEntries}
        setEditedEntry={setEditedEntry}
        setMarker={setMarker}
        setValue={placeSetValue}
        editedEntry={editedEntry}
        reset={placeReset}
      />
    </Box>
  );
};

export default create;
