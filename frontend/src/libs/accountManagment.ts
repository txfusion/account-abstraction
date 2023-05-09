
type ConnectAccountProps = {
  setConnected: any;
  adressValue: any;
};

type DisconectAccountProps = {
  setConnected: any;
};

export function connectAccount({ adressValue, setConnected }: ConnectAccountProps) {
  setConnected(true)
}

export function disconectAccount({ setConnected }: DisconectAccountProps) {
  setConnected(false)
}

export function createAccount() {
}