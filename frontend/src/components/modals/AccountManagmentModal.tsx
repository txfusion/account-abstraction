import {
  Flex,
  ModalBody,
  FormControl,
} from "@chakra-ui/react";
import { PurpleInput } from "../inputs/PurpleInput";
import { PurpleButton } from "../buttons/PurpleButton";
import { useEffect, useState } from "react";
import GrayModal from "./GrayModal";
import { useAccount } from "wagmi";

type Props = {
  setConnected: any;
  connectAccount: any;
  createAccount: any;
  isOpen: any;
  onClose: any;
};

export default function AccountManagmentModal({ isOpen, onClose, connectAccount, createAccount, setConnected }: Props) {

  const [adressValue, setAddressValue] = useState('');
  const [sig, setSigner] = useState();

  let { isConnected, connector, address } = useAccount();

	const getSigner = async () => {
		const a = await connector?.getSigner();
		setSigner(a);
	};

  useEffect(() => {
    getSigner();
  }, []
);

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
                onClick={connectAccount}
                closeClick={onClose}
                attributes={{ adressValue, setConnected }}
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
              onClick={createAccount}
              attributes={{ setConnected, sig, "ownerAddress" : address }}
              closeClick={onClose}
              text={"Create Account"} />
          </Flex>
        </ModalBody>
      </GrayModal>
    </>
  )
}