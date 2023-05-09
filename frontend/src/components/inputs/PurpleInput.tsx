import { Box, FormLabel, Input, InputGroup, InputLeftElement, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  text: String,
  placeHolder: string,
  setValue: any
  w?: string
  h?: string
  icon?: JSX.Element
}

export function PurpleInput({ text, setValue, placeHolder, w, h, icon }: Props) {
  return (
    <>
      <Box mb="4" w={w} h={h}>
        <FormLabel>
          <Text color="system-gray.500" fontSize="l">
            {text}
          </Text>
        </FormLabel>
        <InputGroup>
          {icon ? <InputLeftElement
            pointerEvents='none'
            children={icon}
          /> : null}
          <Input
            border="0.06rem"
            backgroundColor="system-gray.100"
            borderStyle="solid"
            borderColor="system-purple.500"
            borderRadius="3xl"
            placeholder={placeHolder}
            textColor="white"
            onChange={e => { setValue(e.currentTarget.value); }}
          />
        </InputGroup>
      </Box>
    </>
  );
};