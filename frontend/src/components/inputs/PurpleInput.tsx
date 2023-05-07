import { Box, Flex, FormLabel, Input, Text } from "@chakra-ui/react";

type Props = {
  text: String,
  placeHolder: string,
  setValue: any
}

export function PurpleInput({ text, setValue, placeHolder }: Props) {
  return (
    <>
      <Box mb="4">
        <FormLabel>
          <Text color="system-gray.500" fontSize="l">
            {text}
          </Text>
        </FormLabel>
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
      </Box>
    </>
  );
};