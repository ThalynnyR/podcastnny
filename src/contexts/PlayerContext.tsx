import { createContext, ReactNode, useContext, useState } from 'react';

// Compartilhamento de informações
type Episode = {
  title: string,
  members: string,
  thumbnail: string,
  duration: number,
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>,
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  playList: (list: Episode[], index: number) => void;
  setPlayingState: (state: boolean) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const PlayerContext = createContext({} as PlayerContextData)

type PlayerContextProviderProps = {
  children: ReactNode; // qualquer coisa html, conteudo jsx
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function playList(list: Episode[], index: number) {
    setEpisodeList(list); // passa uma lista de episodios
    setCurrentEpisodeIndex(index); // qual episodio tocou
    setIsPlaying(true); // se a pessoa tiver pausado e despausar tem que tocar direto

  }

  function play(episode: Episode) { // jogar dentro do episodeList
    setEpisodeList([episode]); // só um dentro do array
    setCurrentEpisodeIndex(0); // então esse precisa ser o tocado no momento, forçando ser o unico do array, ou seja, 0
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying); // se tiver pause, vira play e vice versa
  }

  function toggleLoop() {
    setIsLooping(!isLooping); // rodar infinito
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling); // embaralhar, aleatório
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state)
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || ((currentEpisodeIndex + 1) < episodeList.length);

  function playNext() {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);

    } else if (hasNext) { // barrar que ele toque um numero maior do que o que tem na lista
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);

    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }


  return (
    <PlayerContext.Provider
      value={{ // Compartilhamento de dados, informações estilo redux, 
        episodeList, // o que estiver aqui será compartilhado
        currentEpisodeIndex,
        play,
        playList,
        playNext,
        playPrevious,
        isPlaying,
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        clearPlayerState,
        hasNext,
        hasPrevious,
      }} >

      {children} {/* recebendo o que está sendo passado no _app. */}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}