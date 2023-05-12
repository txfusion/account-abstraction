import '@rainbow-me/rainbowkit/styles.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Providers from '@/Providers/Providers';

// components
import { NavBar } from '../components/NavBar';
import Footer from '@/components/Footer';

function App({ Component, pageProps }: AppProps) {
	return (
		<Providers>
			<NavBar />
			<main>
				<Component {...pageProps} />
			</main>
			<Footer />
		</Providers>
	);
}

export default App;
