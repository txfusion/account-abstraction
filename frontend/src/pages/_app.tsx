import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NavBar } from "../components/NavBar";
import defaultChains from "../libs/chains"
import '../styles/globals.css';

const { chains, provider } = configureChains(
  defaultChains,
  [alchemyProvider({ alchemyId: "25e2b5d7aed718520473680e045a32b6" }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Tx Fusion",
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

const theme = extendTheme({
  colors: {
    'system-gray': {
      'purple': "#623485",
      100: "#2C2D31",
      500: "#989DAC"
    },
    'system-purple': {
      500: "#623485",
    },
  },
})


function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
        accentColor: '#623485',
        accentColorForeground: 'white',
        borderRadius: 'large',
      })} modalSize="compact" coolMode={true}>
        <ChakraProvider theme={theme}>
          <NavBar />
          <Component {...pageProps} />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App
