"use client"
import { smartAccount } from "@/redux/account.slice";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";


interface IProvider {
    children: React.ReactNode;
}

const RouterProvider = ({ children }: IProvider) => {
    const { isConnected } = useAccount();
    const { chain } = useNetwork()
    const { connected } = useSelector(smartAccount);
    const router = useRouter();

    useEffect(() => {
        if (!isConnected || chain?.unsupported) {
            router.push('/app/wallet')
        } else if (!connected) {
            router.push('/app/account')
        } else if (isConnected && connected) {
            router.push('/app/swap')
        }
    }, [isConnected, connected, chain]);

    return (
        <>
            {children}
        </>
    );
};

export default RouterProvider;
