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
import { useSelector } from 'react-redux';
import { smartAccount } from '@/redux/account.slice';

function Dashboard() {
	const { connected } = useSelector(smartAccount);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const [globalFilter, setGlobalFilterState] = useState('');

	return (
		<>
			<AccountManagmentModal isOpen={isOpen} onClose={onClose} />
			<div className='w-full'>
				<div className='w-full max-w-screen-xl mx-auto'>
					<div className='flex'>
						<Tabs
							variant='soft-rounded'
							colorScheme='green '
							className='w-full'>
							<TabList>
								<Tab
									textColor='white'
									_selected={{
										bg: 'system-purple.500',
									}}>
									Deposit
								</Tab>
								<Tab
									textColor='white'
									_selected={{
										bg: 'system-purple.500',
									}}>
									Withdraw
								</Tab>
							</TabList>

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
													data={masterChefDetails.pools}
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
											{/* <div className='text-white'>
												{tokenBalance?.formatted}
											</div> */}
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
