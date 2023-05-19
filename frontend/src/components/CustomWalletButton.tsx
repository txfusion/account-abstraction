"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';

export const CustomWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted
      }) => {
        const connected =
          mounted &&
          account &&
          chain;
        return (
          <div
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button type="button" className="text-white bg-blue-300 hover:bg-blue-400 focus:ring-1 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-md px-5 py-2.5 text-center mr-2 mb-2" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button type="button" className="text-white bg-gradient-to-r from-red-300 to-red-600 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-purple-800 font-medium rounded-lg text-md px-5 py-2.5 text-center mr-2 mb-2" onClick={openChainModal}>
                    Wrong network
                  </button>
                );
              }
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};