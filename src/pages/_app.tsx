import React, { useState } from 'react';
import '../styles/global.scss';

import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';
import { PlayerContextProvider } from '../contexts/PlayerContext';

// por volta de todas as nossas paginas
function MyApp({ Component, pageProps }) {
 return ( 
   <PlayerContextProvider>
    {/* Todos os components que estiverem aqui dentro tem acesso as informacoes de Playcontext, tipo Thalynny */}
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  )
}

export default MyApp
