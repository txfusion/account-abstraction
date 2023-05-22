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
import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store';
import defaultChains from '../libs/chains';
import RouterProvider from './RouterProvider';

const { chains, provider } = configureChains(defaultChains, [publicProvider()]);

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
				<ReduxProvider store={store}>
					<RouterProvider>
						{children}
					</RouterProvider>
				</ReduxProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default Providers;