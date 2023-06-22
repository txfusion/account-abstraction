import { Flex, FormControl } from "@chakra-ui/react";
import { PurpleInput } from "./inputs/PurpleInput";
import { PurpleButton } from "./buttons/PurpleButton";

export const SendTransaction = () => {
  return (
    <Flex w="50%" m={3}>
      <FormControl>
        <PurpleInput placeHolder="0x3D...G4K3" setValue={null} text={"Address"}></PurpleInput>
        <PurpleInput placeHolder="1 ETH" setValue={null} text={"Coins"}></PurpleInput>
        <Flex mt={2} mb={4}>
          <PurpleButton onClick={null} text={"Send"}></PurpleButton>
        </Flex>
      </FormControl>
    </Flex>)
};