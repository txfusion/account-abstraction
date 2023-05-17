import { Provider } from 'zksync-web3';

const FALLBACK_URL = 'http://localhost:3050';
const FALLBACK_CHAIN_ID = 270;

export function getFallbackProvider() {
	return new Provider(FALLBACK_URL, FALLBACK_CHAIN_ID);
}
