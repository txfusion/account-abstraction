'use client';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import {
	Box,
	Text,
	Grid,
	GridItem,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import {
	connectAccount,
	createAccount,
	disconectAccount,
} from '@/libs/accountManagment';
import { AccountButton } from '@/components/buttons/AccountButton';
import { depositColumns } from '../components/tables/DepositTableConfig';
import AccountManagmentModal from '@/components/modals/AccountManagmentModal';
import { DataTable } from '@/components/tables/DataTable';
import { withdrawColumns } from '@/components/tables/WithdrawTableConfig';
import { masterChefDetails } from '@/components/masterChef';
import { useBalance } from 'wagmi';
import { address } from '@/libs/address';

function Dashboard() {
	let { isConnected, connector } = useAccount();
	let [connected, setConnected] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [globalFilter, setGlobalFilterState] = useState('');

	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);
	const [sig, setSigner] = useState(false);

	const { data: tokenBalance } = useBalance({
		address: address.account as `0x${string}`,
		token: address.lptoken as `0x${string}`,
	});

	console.log('Token Balance', tokenBalance);
	const getSigner = async () => {
		const a = await connector?.getSigner();
		setSigner(a);
	};
	useEffect(() => {
		getSigner();
		setLoading(true);
		fetch('/api/pools/all')
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;

	return (
		<>
			<AccountManagmentModal
				isOpen={isOpen}
				onClose={onClose}
				setConnected={setConnected}
				connectAccount={connectAccount}
				createAccount={createAccount}
			/>
			<div className='w-full'>
				<div className='w-full max-w-screen-lg mx-auto'>
					<div className='flex'>
						<Tabs variant='unstyled' colorScheme='black ' className='w-full'>
							<TabList>
								<Tab textColor='system-purple.500'>Deposit</Tab>
								<Tab textColor='system-purple.500'>Withdraw</Tab>
							</TabList>
							<TabIndicator
								mt='-5.5px'
								height='2px'
								bg='system-purple.500'
								borderRadius='1px'
							/>
							<div className='flex flex-row gap-4 mt-4'>
								<TabPanels>
									<TabPanel p={0}>
										<Box
											justifyItems='center'
											backgroundColor='black'
											borderStyle='solid'
											borderColor='system-purple.500'
											borderRadius='3xl'>
											<Box
												backgroundColor='system-gray.900'
												borderStyle='solid'
												border='0.1rem'
												borderRadius='2xl'
												pt='2'
												pb='10'>
												<DataTable
													columns={depositColumns}
													data={masterChefDetails.pools}
													globalFilter={globalFilter}
													setGlobalFilterState={setGlobalFilterState}
												/>
											</Box>
										</Box>
									</TabPanel>
									<TabPanel p={0}>
										<Box
											justifyItems='center'
											backgroundColor='black'
											borderStyle='solid'
											borderColor='system-purple.500'
											borderRadius='3xl'>
											<Box
												backgroundColor='system-gray.900'
												borderStyle='solid'
												border='0.4rem'
												borderRadius='2xl'
												pt='2'
												pb='10'>
												<DataTable
													columns={withdrawColumns}
													data={data}
													globalFilter={globalFilter}
													setGlobalFilterState={setGlobalFilterState}
												/>
											</Box>
										</Box>
									</TabPanel>
								</TabPanels>

								<Box
									backgroundColor='system-gray.900'
									borderRadius='2xl'
									p={5}
									height='fit-content'>
									<div>
										<div className='flex flex-col gap-6'>
											<p className='font-semibold text-white '>
												Make sure you connect with Smart Account before making
												transactions!
											</p>
											{!connected ? (
												<PurpleButton
													onClick={onOpen}
													text={'Connect with Smart Account'}
												/>
											) : (
												<AccountButton
													disconnect={disconectAccount}
													setConnected={setConnected}
												/>
											)}
										</div>
										{/* <Box
											mt='10%'
											p={5}
											justifyItems='center'
											border='0.1rem'
											backgroundColor='black'
											borderStyle='solid'
											borderColor='system-purple.500'
											borderRadius='3xl'>
											<Text mb='2' textColor='white'>
												Something here!
											</Text>
										</Box> */}
									</div>
								</Box>
							</div>
						</Tabs>
					</div>
				</div>
			</div>
		</>
	);
}

export default Dashboard;
