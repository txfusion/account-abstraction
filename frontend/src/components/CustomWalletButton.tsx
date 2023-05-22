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
                  <button type="button" className="text-white bg-blue-300 hover:bg-blue-400 focus:ring-1 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-md px-5 py-2.5 text-center" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button type="button" className="text-white bg-red-400 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-100 font-medium rounded-lg text-md px-5 py-2.5 text-center" onClick={openChainModal}>
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