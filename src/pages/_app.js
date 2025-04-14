import '../styles/globals.css';
import '../styles/App.css'
import '../components/Card/Card.css'
import '../components/Categories/Categories.css'
import '../components/DetailsPopup/DetailsPopup.css'
import '../components/EmbedVideoModal/EmbedVideoModal.css'
import '../components/EpisodeSelect/EpisodeSelect.css'
import '../components/Header/Header.css'
import '../components/LoadingSpinner/LoadingSpinner.css'

export default function App({ Component, pageProps }) {
  return (
    <Component {...pageProps} />
  );
}