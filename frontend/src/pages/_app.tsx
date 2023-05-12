import '@rainbow-me/rainbowkit/styles.css';
import { NavBar } from '../components/NavBar';
import '../styles/globals.css';
import Footer from '@/components/Footer';

import Providers from '@/Providers/Providers';

function App({ Component, pageProps }: any) {
	return (
		<Providers>
			<NavBar />
			<main>
				<Component {...pageProps} />
			</main>
			<footer>
				<Footer />
			</footer>
		</Providers>
	);
}

export default App;
