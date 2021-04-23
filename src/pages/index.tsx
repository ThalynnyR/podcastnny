import React, { useContext, useEffect } from "react";
import { GetStaticProps } from 'next'; //tipagem do proprio next
import Image from 'next/image';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Link from 'next/link';
import { convertDurationToTimeString } from '../utils/convertDuration';
import styles from './home.module.scss';
import { PlayerContext } from "../contexts/PlayerContext";

type IEpisodes = { // interface
  id: string,
  title: string,
  members: string,
  publishedAt: string,
  thumbnail: string,
  duration: number,
  durationToString: string,
  url: string,
}

type HomeProp = {
  lastedEpisodes: Array<IEpisodes>
  allEpisodes: Array<IEpisodes>
}

export default function Home({ lastedEpisodes, allEpisodes }: HomeProp) {
  const { play } = useContext(PlayerContext);
  // useEffect(() => { //modelo SPA, só no acesso do usuário
  //   fetch('http://localhost:3333/episodes')
  //     .then((response) => response.json())
  //     .then((data) => console.log(data));
  // }, []) // 1º param: o que quero executar, 2º param: quando

  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>

        <ul>
          {lastedEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                width={192} 
                height={192} 
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover" 
                /> {/* {otimizar a imagem} */}
                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationToString}</span>
                </div>

                <button type="button" onClick={() => play(episode)}>
                  <img src="/play-green.svg" alt="Tocar episodio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
          <h2>Todos os episódios</h2>

          <table cellSpacing={0}>
            <thead>
            <tr>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allEpisodes.map(episode => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                        <a>{episode.title}</a>
                      </Link>
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationToString}</td>
                    <td> 
                      <button type="button" onClick={() => play(episode)}> {/* Enviando um episodio para tocar, episode que vem de dentro do map */}
                        <img src="/play-green.svg" alt="Tocar episódio"/>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

      </section>
    </div>
  )
}

//modelo SSR, sempre carrega na home 
// export async function getServerSideProps() { //passa tudo por props, pela propriedade

export const getStaticProps: GetStaticProps = async () => { // modelo SSG, carrega só de uma vez e mantem, sem precisar carregar todas as vezes
  const { data } = await api.get('episodes', {
    params: { //limite de quant retorando = 12, ordenar pela da de publicacao, em ordem decrescente  
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: episode.thumbnail,
      duration: Number(episode.file.duration),
      durationToString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    }
  })

  //retornar os lancamentos e os restantes separados
  const lastedEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      // episodes: data, // dados puros 
      lastedEpisodes,
      allEpisodes, //dados formatados episodes: episodes
    },
    revalidate: 60 * 60 * 8, // a cada 8 horas a pessoa gera uma nova versão da pagina
  }
}