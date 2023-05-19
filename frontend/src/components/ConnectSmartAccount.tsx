"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from "wagmi";


export const ConnectSmartAccount = () => {
    const { isConnected } = useAccount();
    const { push } = useRouter();

    useEffect(() => {
        if (!isConnected) {
            push('/app/wallet')
        }
    }, [isConnected]);

    return (
        <>
            <div>Connect Smart Account</div>
        </>
    )
};