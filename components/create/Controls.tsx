import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, Flex } from "@chakra-ui/react";
import React from "react";

type Props = {
  leftShown: boolean;
  rightShown: boolean;
  leftText?: string;
  rightText?: string;
  leftAction?: () => void;
  rightAction?: () => void;
};

const Controls = ({
  leftShown,
  rightShown,
  leftText,
  rightText,
  leftAction,
  rightAction,
}: Props) => {
  return (
    <Flex justifyContent="space-between">
      {leftShown && (
        <Button
          onClick={leftAction}
          my={4}
          variant="ghost"
          leftIcon={<ArrowBackIcon />}
        >
          {leftText}
        </Button>
      )}
      {rightShown && (
        <Button
          onClick={rightAction}
          my={4}
          variant="ghost"
          rightIcon={<ArrowForwardIcon />}
        >
          {rightText}
        </Button>
      )}
    </Flex>
  );
};

export default Controls;
