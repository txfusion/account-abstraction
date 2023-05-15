'use client';
import { useEffect, useState } from 'react';

import {
	Box,
	Tab,
	TabIndicator,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useDisclosure,
} from '@chakra-ui/react';
import { PurpleButton } from '@/components/buttons/PurpleButton';
import { AccountButton } from '@/components/buttons/AccountButton';
import { depositColumns } from '../components/tables/DepositTableConfig';
import AccountManagmentModal from '@/components/modals/AccountManagmentModal';
import { DataTable } from '@/components/tables/DataTable';
import { withdrawColumns } from '@/components/tables/WithdrawTableConfig';
import { masterChefDetails } from '@/components/masterChef';
import { address } from '@/libs/address';
import { useSelector } from 'react-redux';
import { smartAccount } from '@/redux/account.slice';
import { useBalance } from 'wagmi';

function Dashboard() {
	const { connected } = useSelector(smartAccount);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [globalFilter, setGlobalFilterState] = useState('');

	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

	const { data: tokenBalance } = useBalance({
		address: address.account as `0x${string}`,
		token: address.lptoken as `0x${string}`,
		watch: true,
	});
	const { data: usdcBalance } = useBalance({
		address: address.account as `0x${string}`,
		token: address.usdc as `0x${string}`,
		watch: true,
	});

	console.log('Token Balance', tokenBalance);

	useEffect(() => {
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
			<AccountManagmentModal isOpen={isOpen} onClose={onClose} />
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
													headerTitle='Deposit'
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
													headerTitle='Withdraw'
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
												<AccountButton />
											)}
											{connected && (
												<div className='flex flex-col'>
													<p className='text-white '>
														Smart Account USDC balance:
													</p>
													<p className='text-white/50 '>
														{usdcBalance?.formatted}
													</p>
												</div>
											)}
										</div>
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
