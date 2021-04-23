import Image from 'next/image';
import { useEffect, useRef, useState} from 'react';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDuration';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null); // para manipular a tag audio
  const [progress, setProgress] = useState(0) //barrinha de progresso

  const { episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    clearPlayerState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious
  } = usePlayer();

  useEffect(() => { //Quando algo muda, usar useEffect
    if (!audioRef.current) return; //current = valor da referencia

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying]) // toda vez que isPlaying mudar, play ou pause ou underfined

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    }) //ouvir o evento
  }

  function handleSeek(amount: number) { // a duracao que ela colocou a bolinha
    audioRef.current.currentTime = amount; //troca pro valor exato da bolinha
    setProgress(amount); // mudar o progresso pra onde ele colocou
  }

  function handleEpisodeEnded() {
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          {episode ? (
            <Slider
              max={episode.duration} //a duracao max que ele pode chegar em segundos
              value={progress} // o tanto que o episodio já progredio
              trackStyle={{ backgroundColor: '#2E8B57' }} // cor da barra
              railStyle={{ background: '#F4A460' }} // cor de fundo da barra
              handleStyle={{ borderColor: '#2E8B57', borderWidth: 4 }} // cor da bolinha
              onChange={handleSeek} // quando o usuário mexe a bolinha
            />
          ) : (
            <div className={styles.empySlider} />
          )}
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay // o audio já sai tocando
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded} //executar quando o audio chega no final
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            onClick={toggleLoop}
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}