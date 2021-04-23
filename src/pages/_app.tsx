import React, { useState } from 'react';
import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContext } from '../contexts/PlayerContext';

// por volta de todas as nossas paginas
function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  function play(episode) { // jogar dentro do episodeList
    setEpisodeList([episode]); // só um dentro do array
    setCurrentEpisodeIndex(0); // então esse precisa ser o tocado no momento, forçando ser o unico do array, ou seja, 0
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying); // se tiver pause, vira play e vice versa
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  return (
    <PlayerContext.Provider value={{ episodeList, currentEpisodeIndex, play, isPlaying, togglePlay, setPlayingState }}> {/* Compartilhamento de dados, informações estilo redux */}
    {/* Todos os components que estiverem aqui dentro tem acesso as informacoes de Playcontext, tipo Thalynny */}
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
