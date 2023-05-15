import {
  Flex,
  ModalBody,
  FormControl,
} from "@chakra-ui/react";
import { PurpleInput } from "../inputs/PurpleInput";
import { PurpleButton } from "../buttons/PurpleButton";
import { useState } from "react";
import GrayModal from "./GrayModal";
import { useAccount } from "wagmi";
import { deployAccount } from "@/web3/services/deployAccount";
type Props = {
  isOpen: any;
  onClose: any;
};

export default function AccountManagmentModal({ isOpen, onClose }: Props) {

  const [adressValue, setAddressValue] = useState('');

  let { address } = useAccount();

  return (
    <>
      <GrayModal isOpen={isOpen} onClose={onClose} header={"Account Managment"}>
        <ModalBody
          pb={6}
          borderBottom="0.06rem"
          borderBottomColor="system-purple.500"
          borderBottomStyle="dashed">
          <FormControl>
            <PurpleInput
              placeHolder="0xA4...B4D5"
              setValue={setAddressValue}
              text={"Connect Account"} />
            <Flex
              alignItems="center"
              mt={2}
              mb={4}>
              <PurpleButton
                onClick={null}
                closeClick={onClose}
                attributes={{ adressValue }}
                text={"Connect"} />
            </Flex>
          </FormControl>
        </ModalBody>
        <ModalBody
          pb={6}>
          <Flex
            alignItems="center"
            mt={2}>
            <PurpleButton
              onClick={deployAccount}
              attributes={{"ownerAddress" : address }}
              closeClick={onClose}
              text={"Create Account"} />
          </Flex>
        </ModalBody>
      </GrayModal>
    </>
  )
}