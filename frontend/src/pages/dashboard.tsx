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

function Dashboard() {
	let { isConnected } = useAccount();
	let [connected, setConnected] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [globalFilter, setGlobalFilterState] = useState('');

	const [data, setData] = useState(null);
	const [isLoading, setLoading] = useState(false);

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
			<AccountManagmentModal
				isOpen={isOpen}
				onClose={onClose}
				setConnected={setConnected}
				connectAccount={connectAccount}
				createAccount={createAccount}
			/>
			<Grid gap={6} ms='10%' me='10%' templateColumns='repeat(2, 1fr)'>
				<GridItem>
					<Tabs variant='unstyled' colorScheme='black'>
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
						<TabPanels>
							<TabPanel>
								<Box
									p={5}
									justifyItems='center'
									border='0.1rem'
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
											columns={depositColumns}
											data={masterChefDetails.pools}
											globalFilter={globalFilter}
											setGlobalFilterState={setGlobalFilterState}
										/>
									</Box>
								</Box>
							</TabPanel>
							<TabPanel>
								<Box
									p={5}
									justifyItems='center'
									border='0.1rem'
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
					</Tabs>
				</GridItem>
				<GridItem w='50%'>
					<VStack p={5} justifyItems='center'>
						{!connected ? (
							<PurpleButton onClick={onOpen} text={'Smart Account'} />
						) : (
							<AccountButton
								disconnect={disconectAccount}
								setConnected={setConnected}
							/>
						)}
						<Text
							mt='1%'
							textColor='white'
							borderBottom='solid'
							borderColor='system-purple.500'>
							Configure Smart Account and use Depoist/Withdrow!
						</Text>
					</VStack>
					<Box
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
					</Box>
				</GridItem>
			</Grid>
		</>
	);
}

export default Dashboard;
