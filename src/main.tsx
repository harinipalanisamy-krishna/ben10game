import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { MusicProvider } from './contexts/MusicContext';

createRoot(document.getElementById("root")!).render(
  <MusicProvider>
    <App />
  </MusicProvider>
);
