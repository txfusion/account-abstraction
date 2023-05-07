import { useEffect, useState } from "react";
import {
  useAccount,
} from "wagmi";
import { SendTransaction } from "../components/SendTransaction";
import { Box, Image, Text, Link, Container, VStack, StackDivider, useDisclosure, Button, FormControl, FormLabel, Input, Flex, Center, AbsoluteCenter } from "@chakra-ui/react";
import AccountManagmentModal from "@/components/AccountManagmentModal";
import { PurpleButton } from "@/components/buttons/PurpleButton";
import { PurpleInput } from "@/components/inputs/PurpleInput";
import { connectAccount, createAccount } from "@/libs/accountManagment";


function Dashboard() {

  let { isConnected } = useAccount();
  let [connected, setConnected] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [adressValue, setAddressValue] = useState('');
  const [coinValue, setCoinValue] = useState('');

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <>
      <AccountManagmentModal isOpen={isOpen} onClose={onClose} setConnected={setConnected} connectAccount={connectAccount} createAccount={createAccount}></AccountManagmentModal>
      <Box
        ms="100"
        mt="100"
        me="100"
        p={4}
        justifyItems="center"
        justifySelf="center"
        border="0.2rem"
        backgroundColor="black"
        borderStyle="solid"
        borderColor="system-purple.500"
        borderRadius="3xl"
      >
        <Flex m={1} mb="50">
          {!connected ? <PurpleButton onClick={onOpen} text={"Account Managment"}></PurpleButton> : null}
        </Flex>
        <Flex w="50%" m={3}>
          <FormControl>
            <PurpleInput placeHolder="" setValue={setAddressValue} text={"Adress Value"}></PurpleInput>
            <PurpleInput placeHolder="" setValue={setCoinValue} text={"Coins"}></PurpleInput>
            <Flex mt={2} mb={4}>
              <PurpleButton onClick={null} text={"Connect"}></PurpleButton>
            </Flex>
          </FormControl>
        </Flex>
      </Box>
    </>
  );
}

export default Dashboard