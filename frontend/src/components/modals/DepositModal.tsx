import { useState } from "react";
import {
    Flex,
    ModalBody,
    FormControl,
    Text,
    Image,
} from "@chakra-ui/react";
import { PurpleInput } from "../inputs/PurpleInput";
import { PurpleButton } from "../buttons/PurpleButton";
import GrayModal from "./GrayModal";
import { Pool } from "@/libs/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/redux/cart.slice";

type Props = {
    isOpen: any;
    onClose: any;
    data: Pool
};

export default function DepositModal({ isOpen, onClose, data }: Props) {

    const [ammount, setAmmount] = useState(0);
    const dispatch = useDispatch();

    return (
        <>
            <GrayModal
                isOpen={isOpen}
                onClose={onClose}
                header={"Deposit"}>
                <ModalBody
                    pb={6}>
                    <FormControl>
                        <PurpleInput
                            size="lg"
                            iconLeft={
                                <Image
                                    boxSize='50%'
                                    alt="Image"
                                    src={data.logoURI} />
                            }
                            iconRight={
                                <Text
                                    me="5"
                                    textColor="white"
                                    size="xs">
                                    {data.symbol}
                                </Text>
                            }
                            placeHolder="0.00"
                            setValue={setAmmount}
                            text={"Amount"} />
                        <Flex
                            alignItems="center"
                            mt={2}>
                            <PurpleButton
                                onClick={() => dispatch(addToCart({item : data, ammount}))}
                                closeClick={onClose}
                                text={"Add to Cart"} />
                        </Flex>
                    </FormControl>
                </ModalBody>
            </GrayModal>
        </>
    )
}