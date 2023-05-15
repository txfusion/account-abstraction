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
import { useDispatch, useSelector } from "react-redux";
import { connectSmartAccount, smartAccount } from "@/redux/account.slice";
type Props = {
  isOpen: any;
  onClose: any;
};

export default function AccountManagmentModal({ isOpen, onClose }: Props) {

  const [adressValue, setAddressValue] = useState(' ');

  let { address } = useAccount();
  const dispatch = useDispatch();

  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [loadingConnect, setLoadingConnect] = useState<boolean>(false);

  const createAccount = async () => {
    setLoadingCreate(true);
    try {
    let smartAccountAdress = await deployAccount(address);
    setLoadingCreate(false);
    dispatch(connectSmartAccount({connected: true, accountAddress: smartAccountAdress }));
    onClose();
    } catch(e) {
      setLoadingCreate(false);
      console.log(e)
    }
  };
  
  const connectAccount = () => {
    setLoadingConnect(true);
    console.log(adressValue);
    dispatch(connectSmartAccount({connected: true, accountAddress: adressValue}));
    setLoadingConnect(false);
    onClose();
  };

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
                isLoading={loadingConnect}
                onClick={connectAccount}
                //closeClick={onClose}
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
              isLoading={loadingCreate}
              onClick={createAccount}
              //closeClick={onClose}
              text={"Create Account"} />
          </Flex>
        </ModalBody>
      </GrayModal>
    </>
  )
}