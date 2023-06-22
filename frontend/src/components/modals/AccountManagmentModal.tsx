import { Flex, ModalBody, FormControl } from '@chakra-ui/react';
import { PurpleInput } from '../inputs/PurpleInput';
import { PurpleButton } from '../buttons/PurpleButton';
import { useState } from 'react';
import GrayModal from './GrayModal';
import { useAccount } from 'wagmi';
import { deployAccount } from '@/web3/services/deployAccount';
import { useDispatch, useSelector } from 'react-redux';
import { connectSmartAccount, smartAccount } from '@/redux/account.slice';
type Props = {
	isOpen: any;
	onClose: any;
};

export default function AccountManagmentModal({ isOpen, onClose }: Props) {
	const [addressValue, setAddressValue] = useState(' ');
	const smartAcc = useSelector(smartAccount);

	const { address } = useAccount();
	const dispatch = useDispatch();

	const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
	const [loadingConnect, setLoadingConnect] = useState<boolean>(false);

	const createAccount = async () => {
		if (!address) {
			console.log(
				'Please connect with you wallet before creating smart account'
			);
			return;
		}
		setLoadingCreate(true);
		try {
			const smartAccountAddress = await deployAccount(address);
			setLoadingCreate(false);
			dispatch(
				connectSmartAccount({
					connected: true,
					accountAddress: smartAccountAddress,
				})
			);
			onClose();
		} catch (e) {
			setLoadingCreate(false);
			console.log(e);
		}
	};

	const connectAccount = () => {
		setLoadingConnect(true);
		dispatch(
			connectSmartAccount({ connected: true, accountAddress: addressValue })
		);
		setLoadingConnect(false);
		onClose();
	};

	return (
		<>
			<GrayModal
				isOpen={isOpen}
				onClose={onClose}
				header={'Account Management'}>
				<ModalBody
					pb={6}
					borderBottom='0.06rem'
					borderBottomColor='system-purple.500'
					borderBottomStyle='dashed'>
					<FormControl>
						<PurpleInput
							placeHolder='0xA4...B4D5'
							setValue={setAddressValue}
							text={'Connect Account'}
						/>
						<Flex alignItems='center' mt={2} mb={4}>
							<PurpleButton
								isLoading={loadingConnect}
								onClick={connectAccount}
								//closeClick={onClose}
								text={'Connect'}
							/>
						</Flex>
					</FormControl>
				</ModalBody>
				<ModalBody pb={6}>
					<Flex alignItems='center' mt={2}>
						<PurpleButton
							isLoading={loadingCreate}
							onClick={createAccount}
							//closeClick={onClose}
							text={'Create Account'}
						/>
					</Flex>
				</ModalBody>
			</GrayModal>
		</>
	);
}
