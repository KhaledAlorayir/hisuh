import { Dispatch, SetStateAction } from "react";
import { ListInfo } from "shared/types";
import { Box, Center, Input, Text, Button, Textarea } from "@chakra-ui/react";
import {
  FieldErrorsImpl,
  FieldValues,
  useForm,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import FormError from "./FormError";

type Props = {
  setListInfo: Dispatch<SetStateAction<ListInfo | undefined>>;
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  errors: Partial<
    FieldErrorsImpl<{
      [x: string]: any;
    }>
  >;
};

const ListInfoForm = ({
  setListInfo,
  errors,
  handleSubmit,
  register,
}: Props) => {
  const submitHandler = (values: any) => {
    setListInfo({ name: values.name, description: values.description });
  };

  return (
    <Center h="100%">
      <Box w={{ base: "100%", md: "70%", lg: "60%" }}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Text mb={8} fontSize="lg" fontWeight="bold" textAlign="center">
            please enter the list info
          </Text>
          <Box mb={6}>
            <Input
              placeholder="list name"
              {...register("name", {
                required: { value: true, message: "name is requierd" },
                minLength: {
                  value: 5,
                  message: "name should be 5-60 characters",
                },
                maxLength: {
                  value: 60,
                  message: "name should be 5-60 characters",
                },
              })}
              isInvalid={!!errors?.name}
            />
            <FormError error={errors.name} />
          </Box>
          <Box mb={6}>
            <Textarea
              placeholder="list description"
              {...register("description", {
                minLength: {
                  value: 5,
                  message:
                    "if a description is added it should be at least 5 characters",
                },
                maxLength: {
                  value: 150,
                  message: "description should be at most 150 characters",
                },
              })}
              resize="none"
              isInvalid={!!errors?.description}
            />
            <FormError error={errors.description} />
          </Box>
          <Button type="submit" w="100%">
            Next
          </Button>
        </form>
      </Box>
    </Center>
  );
};

export default ListInfoForm;
