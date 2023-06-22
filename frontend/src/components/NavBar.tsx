import { useState } from 'react';
import { Box, Button, Flex, HStack, Link, ModalBody } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useRouter } from 'next/router';
import TransactionsModal from './Transactions/TransactionsModal';
import { useSelector } from 'react-redux';
import { selectTransactions } from '@/redux/transactions.slice';

export const NavBar = () => {
	const router = useRouter();

	const transactions = useSelector(selectTransactions.selectAll);

	const numberOfTransactions = transactions?.length || 0;
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<div className='w-full max-w-screen-xl mx-auto'>
			<Box
				// bg='system-purple.500'
				px={4}>
				<Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
					<HStack spacing={8} alignItems={'center'}>
						<Link
							fontSize='xl'
							textColor={`${router.pathname == '/' ? 'white' : 'black'}`}
							fontWeight='bold'
							href='/'
							_hover={{
								textDecoration: 'none',
								textColor: 'system-gray.900',
							}}>
							Yield Farm
						</Link>
					</HStack>

					<div className='flex flex-row gap-3 ml-auto'>
						{/* <button
							onClick={() => setIsOpen(true)}
							className='flex flex-row items-center gap-2 px-3 py-2 text-white bg-black rounded-xl'>
							<p className='font-bold'>TXs</p>
							<div className='flex items-center justify-center px-3 py-1 text-white bg-red-500 rounded-xl'>
								<p className='leading-none'>{numberOfTransactions}</p>
							</div>
						</button> */}
						<button
							onClick={() => setIsOpen(true)}
							type='button'
							className='inline-flex items-center px-5 py-2.5 text-md font-bold text-center text-white bg-[#1a1b1f] rounded-xl '>
							Transactions
							<span className='inline-flex items-center justify-center w-4 h-4 ml-2 text-xs font-semibold text-red-800 bg-red-200 rounded-full'>
								{numberOfTransactions}
							</span>
						</button>
						<TransactionsModal isOpen={isOpen} onClose={closeModal} />
						<ConnectButton />
					</div>
				</Flex>
			</Box>
		</div>
	);
};
