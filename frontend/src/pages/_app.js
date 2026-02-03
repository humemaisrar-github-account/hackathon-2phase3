import '../styles/globals.css';
import { AuthProvider } from '../services/auth';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default MyApp;
