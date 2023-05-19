'use client';

import React from 'react';
import merge from 'lodash.merge';
import '@rainbow-me/rainbowkit/styles.css';
import {
	getDefaultWallets,
	RainbowKitProvider,
	darkTheme,
	AvatarComponent,
	Theme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains([mainnet], [publicProvider()]);

const { connectors } = getDefaultWallets({
	appName: 'Tx Fusion',
	chains,
});

const wagmiClient = createClient({
	autoConnect: true,
	connectors,
	provider,
});

const CustomAvatar: AvatarComponent = () => {
	return null;
};

const myTheme = merge(darkTheme(), {
	colors: {
		accentColor: '#93C5FD',
		accentColorForeground: 'black'
	}
} as Theme);


interface IProvider {
	children: React.ReactNode;
}

const Providers = ({ children }: IProvider) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={myTheme}
				avatar={CustomAvatar}
				modalSize='compact'
				coolMode={true}>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default Providers;