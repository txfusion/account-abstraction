import { rich_wallet } from './rich_wallet';

export const ACCOUNT_OWNER_PRIVATE_KEY = rich_wallet[0].privateKey;
export const SESSION_OWNER_PRIVATE_KEY = rich_wallet[1].privateKey;
export const SESSION_OWNER_ADDRESS = rich_wallet[1].address;