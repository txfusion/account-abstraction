"use client"

import { CustomWalletButton } from "./CustomWalletButton";
import Image from 'next/image';

export const ConnectWallet = () => {

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Image src="/wallet.png" alt="Wallet" width={412} height={412} />
        <div className="text-white pb-2 text-2xl">Welcome to ZkSync Swap</div>
        <div className="text-blue-300 pb-5 text-xs">To get started you'll need to connect your Wallet.</div>
        <CustomWalletButton />
      </div>
    </>
  )
};