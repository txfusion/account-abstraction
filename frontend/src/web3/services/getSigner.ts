import { Signer, Web3Provider } from 'zksync-web3';

export async function getSigner(): Promise<Signer> {
	let signer: any;
	if (typeof window !== 'undefined') {
		signer = new Web3Provider((window as any).ethereum).getSigner();
	}
	return signer;
}
