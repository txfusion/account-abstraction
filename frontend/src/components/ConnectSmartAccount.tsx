"use client"

import { connectSmartAccount, smartAccount } from "@/redux/account.slice";
import { useDispatch } from "react-redux";

export const ConnectSmartAccount = () => {

    const dispatch = useDispatch();

    const createAccount = async () => {
        dispatch(
            connectSmartAccount({
                connected: true,
                accountAddress: "0x123456789",
            })
        );
    };

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div className="text-white pb-2 text-xl">For second step you'll need to setup your smart account</div>
                <div className="text-blue-300 pb-5 text-xs">Create new or connect to exisitng smart account</div>
                <form className="w-full max-w-sm items-center justify-center">
                    <div className="md:flex md:items-center mb-6">
                        <div className="md:w-2/5">
                            <label className="block text-white font-bold md:text-right mb-1 md:mb-0 pr-4">
                                Account Address
                            </label>
                        </div>
                        <div className="md:w-3/5">
                            <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-300" type="text" placeholder="0xA3...B4D3" />
                        </div>
                    </div>
                    <div className="md:flex justify-center mb-6">
                        <button className="shadow w-64 bg-blue-300 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" disabled={true}>
                            Connect Account
                        </button>
                    </div>
                    <div className="md:flex justify-center mb-6 border-b-2 border-gray-200">
                    </div>
                    <div className="md:flex justify-center mt-6">
                        <button className="shadow w-64 bg-blue-300 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" disabled={false} onClick={() => createAccount()}>
                            Create Account
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
};