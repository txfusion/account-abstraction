import { ethers } from 'ethers';
import { EIP712Signer, Signer, Wallet } from 'zksync-web3';

export async function addSignature(
	tx: any,
	signer: Wallet | Signer
): Promise<any> {
	const signedTxHash = EIP712Signer.getSignedDigest(tx);

	const signature = ethers.utils.arrayify(
		ethers.utils.joinSignature(await signer.eip712.sign(tx))
	);
	// const signature = ethers.utils.arrayify(
	// 	ethers.utils.joinSignature(signer._signingKey().signDigest(signedTxHash))
	// );

	tx.customData = {
		...tx.customData,
		customSignature: signature,
	};
	return tx;
}
