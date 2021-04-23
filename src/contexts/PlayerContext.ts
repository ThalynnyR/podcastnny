import { createContext } from 'react';

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
  currentEpisodeIndex: number,
  isPlaying: boolean;
  play: (episode: Episode) => void
  setPlayingState: (state: boolean) => void
  togglePlay: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)
