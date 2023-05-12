
import { deployAccount } from '@/web3/services/deployAccount';



type ConnectAccountProps = {
  setConnected: any;
  adressValue: any;
};

type DisconectAccountProps = {
  setConnected: any;
};

type CreateAccountProps = {
  setConnected: any;
  sig: any
  ownerAddress: string
};

export function connectAccount({ adressValue, setConnected }: ConnectAccountProps) {
  setConnected(true)
}

export function disconectAccount({ setConnected }: DisconectAccountProps) {
  setConnected(false)
}

export function createAccount({setConnected, sig, ownerAddress}: CreateAccountProps) {
    let smartAccountAddress = deployAccount(sig, ownerAddress);
    setConnected(true)
}