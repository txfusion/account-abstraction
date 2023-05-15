import { disconnectSmartAccount } from "@/redux/account.slice";
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, HStack, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";

export function AccountButton() {
    const dispatch = useDispatch();
    
    return (
        <Menu>
            <MenuButton
                borderRadius="xl"
                colorScheme="system-purple"
                as={Button}
                rightIcon={<ChevronDownIcon />}>
                <HStack>
                    <Text>
                        0 ETH
                    </Text>
                    <Text>
                        0xD3...D2T4
                    </Text>
                </HStack>
            </MenuButton>
            <MenuList
                backgroundColor="system-gray.100"
                borderRadius="xl"
                borderColor="system-purple.500"
                borderStyle="solid">
                <MenuItem
                    backgroundColor="system-gray.100"
                    onClick={() => dispatch(disconnectSmartAccount())}>
                    <HStack>
                        <ExternalLinkIcon
                            color="white" />
                        <Text
                            textColor="white">
                            Disconnect
                        </Text>
                    </HStack>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    backgroundColor="system-gray.100"
                    onClick={() => navigator.clipboard.writeText("0xD3...32G3")}>
                    <HStack>
                        <CopyIcon
                            color="white" />
                        <Text
                            textColor="white">
                            Copy Address
                        </Text>
                    </HStack>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};