type Props = {};
import { Box, Button } from "@chakra-ui/react";
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

  /*
    2- places list delete edit
    3- search
    4- conformaition page
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

  return (
    <Box h="100%">
      <Button
        onClick={() => {
          setListInfo(undefined);
          setMarker(undefined);
          placeReset();
        }}
        my={2}
        variant="ghost"
        leftIcon={<ArrowBackIcon />}
      >
        edit list info
      </Button>
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
      />
      <PlacesList entries={entries} />
    </Box>
  );
};

export default create;
