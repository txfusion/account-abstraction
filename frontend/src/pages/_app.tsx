import "@rainbow-me/rainbowkit/styles.css";
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


function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} theme={darkTheme({
      accentColor: '#623485',
      accentColorForeground: 'white',
      borderRadius: 'large',
      fontStack: 'system',  
    })} modalSize="compact" coolMode={true}>
        <NavBar/>
        <Component {...pageProps} />
      </RainbowKitProvider>

    </WagmiConfig>
  );
}

export default App
