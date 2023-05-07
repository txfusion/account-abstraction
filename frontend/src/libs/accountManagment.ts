
type ConnectAccountProps = {
    setConnected: any;
    adressValue: any;
  };

export function connectAccount({adressValue, setConnected}: ConnectAccountProps) {
    alert("Adress is " + adressValue)
    setConnected(true)
}

export function createAccount() {
    alert("Create Account")
}