import { Input, Box, Textarea, Button, Text, useToast } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import {
  FieldErrorsImpl,
  FieldValues,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { Entry, MarkerItem } from "shared/types";
import FormError from "./FormError";

type Props = {
  marker: MarkerItem | undefined;
  setMarker: Dispatch<SetStateAction<MarkerItem | undefined>>;
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
  isValid: boolean;
  entries: Entry[];
  setEntries: Dispatch<SetStateAction<Entry[]>>;
  reset: UseFormReset<FieldValues>;
};

const AddPlaceForm = ({
  marker,
  register,
  handleSubmit,
  errors,
  isValid,
  entries,
  setEntries,
  setMarker,
  reset,
}: Props) => {
  const toast = useToast();

  const submitHandler = (values: any) => {
    if (entries.length < 15) {
      setEntries((state) => [
        ...state,
        {
          name: values.name.trim(),
          description: values.description.trim() || undefined,
          lat: marker?.lat || 0,
          lon: marker?.lng || 0,
        },
      ]);
      toast({
        title: "place has been added",
        description: `${values.name.trim()} has been added to the list!`,
        status: "success",
        isClosable: true,
        duration: 8000,
      });
      setMarker(undefined);
      reset();
    } else {
      toast({
        title: "only 15 places allowed",
        description: "sorry, only 15 places are allowed per list!",
        status: "error",
        isClosable: true,
        duration: 8000,
      });
    }
  };
  return (
    <Box mt={2}>
      {marker && (
        <form onSubmit={handleSubmit(submitHandler)}>
          <Box mb={4}>
            <Input
              placeholder="place name"
              {...register("name", {
                required: { value: true, message: "name is requierd" },
                minLength: {
                  value: 1,
                  message: "name should be 1-60 characters",
                },
                maxLength: {
                  value: 60,
                  message: "name should be 1-60 characters",
                },
              })}
              isInvalid={!!errors?.name}
            />
            <FormError error={errors.name} />
          </Box>
          <Box mb={4}>
            <Textarea
              placeholder="place description"
              resize="none"
              {...register("description", {
                minLength: {
                  value: 5,
                  message:
                    "if a description is added it should be at least 5 characters",
                },
                maxLength: {
                  value: 100,
                  message: "description should be at most 100 characters",
                },
              })}
              isInvalid={!!errors?.description}
            />
            <FormError error={errors.description} />
          </Box>
          <Button disabled={!isValid} variant="outline" type="submit">
            Add Place
          </Button>
        </form>
      )}
    </Box>
  );
};

export default AddPlaceForm;
