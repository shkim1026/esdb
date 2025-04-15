import '../styles/globals.css';
import '../styles/App.css';
import '../components/Header/Header.module.css';  //Prevents FOUC
import Header from '../components/Header/Header'; //Prevents FOUC
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}