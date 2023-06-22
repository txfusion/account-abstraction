import { ReactNode } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    Text,
    ModalFooter
} from "@chakra-ui/react";

type Props = {
    isOpen: any;
    onClose: any;
    header: string;
    children?: ReactNode
    childrenFooter?: ReactNode
};

export default function GrayModal({ isOpen, onClose, header, children, childrenFooter }: Props) {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                isCentered>
                <ModalOverlay />
                <ModalContent
                    borderRadius="3xl"
                    border="0.12rem"
                    borderStyle="solid"
                    borderColor="system-gray.100"
                    backgroundColor="system-gray.900">
                    <ModalHeader>
                        <Text
                            color="white"
                            fontSize="xl">
                            {header}
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton
                        size='sm'
                        color="system-gray.500"
                        fontSize="xs"
                        borderRadius="3xl"
                        backgroundColor="system-gray.100" />
                    {children}
                </ModalContent>
                <ModalFooter>
                    {childrenFooter}
                </ModalFooter>
            </Modal>
        </>
    )
}