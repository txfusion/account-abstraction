"use client"

export const Swap = () => {

    return (
        <>
            <div className="flex flex-col max-w items-center bg-slider-color border border-transparent rounded-lg shadow">
                <div className="p-2 text-lg text-white">
                    ZkSync Swap
                </div>
                <div className="flex flex-col pr-2 pl-2">
                    <div className="mb-5 max-w rounded-full border-b border-white" />
                    <div className="flex flex-col p-2 m-2 max-w max-h-lg bg-global-color border border-transparent rounded-lg shadow items-center">
                        <div className="flex">
                            <input className="md:w-7/12 py-2 px-4 text-white bg-global-color leading-tight focus:outline-none focus:border-blue-300" type="text" placeholder="0xA3...B4D3" />
                            <button type="button" className="md:w-5/12 px-5 flex items-center justify-self-center bg-black rounded-full border-2 border-transparent">
                                <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/ethereum-43-912185.png?f=avif&w=256" alt="ETH" height="20" width="20" className="me-2" />
                                <div className="text-white">ETH</div>
                            </button>
                        </div>
                        <div className="flex self-end mt-2 text-sm text-blue-300">
                            Balance: 100
                        </div>
                    </div>
                    <div className="flex items-center sm:justify-center -my-5">
                        <button type="button"
                        className="flex items-center relative w-10 h-10 rounded-xl translate-x-[60px] border-2 border-gray-700 bg-gray-800 cursor-pointer text-gray-400 sm:translate-x-0 sm:my-1 sm:w-12 sm:h-12 sm:rounded-xl hover:text-gray-50 button">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="w-5 h-5 text-blue-300" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"></path>
                            </svg>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" className="w-5 h-5 text-blue-300" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col p-2 m-2 max-w max-h-lg bg-global-color border border-transparent rounded-lg shadow bg-global-color items-center mb-6">
                        <div className="flex">
                            <input className="md:w-7/12 py-2 bg-global-color px-4 text-white leading-tight focus:outline-none focus:border-blue-300" type="text" placeholder="0xA3...B4D3" />
                            <button type="button" className="md:w-5/12 px-5 flex items-center bg-black rounded-full border-2 border-transparent">
                                <img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/ethereum-43-912185.png?f=avif&w=256" alt="Image" height="20" width="20" className="me-2" />
                                <div className="text-white">ETH</div>
                            </button>
                        </div>
                        <div className="flex self-end mt-2 text-sm text-blue-300">
                            Balance: 100
                        </div>
                    </div>
                    <div className="mb-5 max-w rounded-full border-b border-white" />
                    <div className="flex justify-center mb-6">
                        <button className="shadow w-full bg-blue-300 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" disabled={false}>
                            Swap
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};    