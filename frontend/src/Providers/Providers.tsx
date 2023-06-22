'use client';
import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
	getDefaultWallets,
	RainbowKitProvider,
	darkTheme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import defaultChains from '../libs/chains';

// Redux
import { Provider as ReduxProvider } from 'react-redux';
import store from '../redux/store';

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

const theme = extendTheme({
	colors: {
		'system-gray': {
			900: '#24262A',
			100: '#2C2D31',
			500: '#989DAC',
		},
		'system-purple': {
			500: '#623485',
		},
	},
	styles: {
		global: () => ({
			body: {
				bg: 'black',
			},
		}),
	},
});

interface IProvider {
	children: React.ReactNode;
}

const Providers = ({ children }: IProvider) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider
				chains={chains}
				theme={darkTheme({
					accentColor: '#623485',
					accentColorForeground: 'white',
					borderRadius: 'large',
				})}
				modalSize='compact'
				coolMode={true}>
				<ChakraProvider theme={theme}>
					<ReduxProvider store={store}>{children}</ReduxProvider>
				</ChakraProvider>
			</RainbowKitProvider>
		</WagmiConfig>
	);
};

export default Providers;
