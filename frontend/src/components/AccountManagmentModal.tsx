import {
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  FormControl,
} from "@chakra-ui/react";
import { PurpleInput } from "./inputs/PurpleInput";
import { PurpleButton } from "./buttons/PurpleButton";
import { useState } from "react";

type Props = {
  setConnected: any;
  connectAccount: any;
  createAccount: any;
  isOpen: any;
  onClose: any;
};

export default function AccountManagmentModal({ isOpen, onClose, connectAccount, createAccount, setConnected }: Props) {

  const [adressValue, setAddressValue] = useState('');

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          borderRadius="3xl"
          backgroundColor="black"
        >
          <ModalHeader>
            <Text color="white" fontSize="xl">
              Account Managment
            </Text>
          </ModalHeader>
          <ModalCloseButton
            size='sm'
            color="system-gray.500"
            fontSize="xs"
            borderRadius="3xl"
            backgroundColor="system-gray.100"
          />
          <ModalBody pb={6}
            borderBottom="0.06rem"
            borderBottomColor="system-purple.500"
            borderBottomStyle="dashed"
          >
            <FormControl>
              <PurpleInput placeHolder="0xA4...B4D5" setValue={setAddressValue} text={"Connect Account"}></PurpleInput>
              <Flex alignItems="center" mt={2} mb={4}>
                <PurpleButton onClick={connectAccount} attributes={{adressValue, setConnected}} text={"Connect"}></PurpleButton>
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalBody pb={6}>
            <Flex alignItems="center" mt={2}>
              <PurpleButton onClick={createAccount} text={"Create Account"}></PurpleButton>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}