import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AudioPlayer from './components/AudioPlayer';
import Home from './pages/Home';
import EpisodeDetail from './pages/EpisodeDetail';
import podcastData from '../podcast.json';
import './App.css';

function App() {
  const podcast = podcastData?.props?.pageProps?.podcast;

  return (
    <PlayerProvider>
      <BrowserRouter>
        <div className="app">
          <Header podcastInfo={podcast} />

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home podcastData={podcastData} />} />
              <Route
                path="/episode/:eid"
                element={<EpisodeDetail podcastData={podcastData} />}
              />
            </Routes>
          </main>

          <Footer contacts={podcast?.contacts} />

          <AudioPlayer />
        </div>
      </BrowserRouter>
    </PlayerProvider>
  );
}

export default App;
