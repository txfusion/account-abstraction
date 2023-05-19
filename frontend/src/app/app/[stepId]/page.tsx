"use client"

import { ConnectSmartAccount } from "@/components/ConnectSmartAccount";
import { ConnectWallet } from "@/components/ConnectWallet";
import { Step } from "@/components/Slider";
import { Swap } from "@/components/Swap";

export default function App({ params }: { params: { stepId: Step } }) {

  return (
    <>
      {params.stepId == Step.WALLET && <ConnectWallet />}
      {params.stepId == Step.ACCOUNT && <ConnectSmartAccount />}
      {params.stepId == Step.SWAP && <Swap />}
    </>
  )
}