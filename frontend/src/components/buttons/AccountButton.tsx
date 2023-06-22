import { address } from '@/libs/address';
import { disconnectSmartAccount, smartAccount } from '@/redux/account.slice';
import { ChevronDownIcon, CopyIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import {
    Button,
    HStack,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useBalance } from 'wagmi';

export function AccountButton() {
    const dispatch = useDispatch();
    const { accountAddress } = useSelector(smartAccount);

    const { data: tokenBalance } = useBalance({
        address: accountAddress as `0x${string}`,
        token: address.lptoken as `0x${string}`,
        watch: true,
    });
    const { data: usdcBalance } = useBalance({
        address: accountAddress as `0x${string}`,
        token: address.usdc as `0x${string}`,
        watch: true,
    });

    return (
        <Menu>
            <MenuButton
                borderRadius='xl'
                colorScheme='system-purple'
                as={Button}
                rightIcon={<ChevronDownIcon />}>
                <HStack>
                    <Text>{usdcBalance?.formatted} USDC</Text>
                    <Text>{accountAddress &&
                        `${accountAddress.slice(0, 4)}...${accountAddress.slice(
                            accountAddress.length - 4,
                            accountAddress.length
                        )}`}</Text>
                </HStack>
            </MenuButton>
            <MenuList
                backgroundColor='system-gray.100'
                borderRadius='xl'
                borderColor='system-purple.500'
                borderStyle='solid'>
                <MenuItem
                    backgroundColor='system-gray.100'
                    onClick={() => dispatch(disconnectSmartAccount())}>
                    <HStack>
                        <ExternalLinkIcon color='white' />
                        <Text textColor='white'>Disconnect</Text>
                    </HStack>
                </MenuItem>
                <MenuDivider />
                <MenuItem
                    backgroundColor='system-gray.100'
                    onClick={() => navigator.clipboard.writeText(accountAddress)}>
                    <HStack>
                        <CopyIcon color='white' />
                        <Text textColor='white'>Copy Address</Text>
                    </HStack>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}
