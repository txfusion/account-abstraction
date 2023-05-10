import {
  Box,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';


export const NavBar = () => {
  const router = useRouter();

  return (
    <>
      <Box
        bg='system-purple.500'
        px={4}>
        <Flex
          h={16}
          alignItems={'center'}
          justifyContent={'space-between'}>
          <HStack
            spacing={8}
            alignItems={'center'}>
            <Link
              fontSize="xl"
              textColor={`${router.pathname == "/" ? "black" : "white"}`}
              fontWeight="bold"
              href='/'
              _hover={{
                textDecoration: 'none',
                textColor: "system-gray.900"
              }}>
              Home
            </Link>
            <Link
              fontSize="xl"
              textColor={`${router.pathname == "/dashboard" ? "black" : "white"}`}
              fontWeight="bold"
              href='/dashboard'
              _hover={{
                textDecoration: 'none',
                textColor: "system-gray.900"
              }}>
              Dashboard
            </Link>
          </HStack>
          <ConnectButton />
        </Flex>
      </Box>
    </>
  );
}