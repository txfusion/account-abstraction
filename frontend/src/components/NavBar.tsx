import { useState } from 'react';
import { Box, Flex, HStack, Link, ModalBody } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import GrayModal from './modals/GrayModal';
import TransactionsModal from './Transactions/TransactionsModal';

export const NavBar = () => {
	const router = useRouter();

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Box bg='system-purple.500' px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
					<HStack spacing={8} alignItems={'center'}>
						<Link
							fontSize='xl'
							textColor={`${router.pathname == '/' ? 'black' : 'white'}`}
							fontWeight='bold'
							href='/'
							_hover={{
								textDecoration: 'none',
								textColor: 'system-gray.900',
							}}>
							Home
						</Link>
						<Link
							fontSize='xl'
							textColor={`${
								router.pathname == '/dashboard' ? 'black' : 'white'
							}`}
							fontWeight='bold'
							href='/dashboard'
							_hover={{
								textDecoration: 'none',
								textColor: 'system-gray.900',
							}}>
							Dashboard
						</Link>
					</HStack>
					<div className='flex flex-row gap-10 ml-auto'>
						<button
							onClick={() => setIsOpen(true)}
							className='px-3 py-2 text-white bg-black rounded-md'>
							Tx list
						</button>
						<TransactionsModal isOpen={isOpen} onClose={closeModal} />

						<ConnectButton />
					</div>
				</Flex>
			</Box>
		</>
	);
};
