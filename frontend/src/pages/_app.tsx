import "@rainbow-me/rainbowkit/styles.css";
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NavBar } from "../components/NavBar";
import defaultChains from "../libs/chains"
import '../styles/globals.css';
import Footer from "@/components/Footer";
import { Provider } from 'react-redux';
import store from '../redux/store';

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
      900: "#24262A",
      100: "#2C2D31",
      500: "#989DAC"
    },
    'system-purple': {
      500: "#623485",
    },
  },
  styles: {
    global: () => ({
      body: {
        bg: "black"
      },
    }),
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
          <Provider store={store}>
            <NavBar />
            <main>
              <Component {...pageProps} />
            </main>
            <footer className="footer">
              <Footer />
            </footer>
          </Provider>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App
