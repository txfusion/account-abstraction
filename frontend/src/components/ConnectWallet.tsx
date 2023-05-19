"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CustomWalletButton } from "./CustomWalletButton";
import { useAccount } from "wagmi";


export const ConnectWallet = () => {
  const { isConnected } = useAccount();
  const { push } = useRouter();

  useEffect(() => {
    if (isConnected) {
      push('/app/account')
    }
  }, [isConnected]);

  return (
    <>
      <CustomWalletButton />
    </>
  )
};