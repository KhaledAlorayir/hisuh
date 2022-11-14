import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { Text } from "@chakra-ui/react";

type Props = {
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
};

const FormError = ({ error }: Props) => {
  return (
    <>
      {!!error && (
        <Text textColor="red.400" ml={3} mt={1} fontWeight="semibold">
          - {error.message?.toString()}
        </Text>
      )}
    </>
  );
};

export default FormError;
