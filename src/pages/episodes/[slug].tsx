import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

import { GetStaticPaths, GetStaticProps } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router';

import { api } from '../../services/api'
import { convertDurationToTimeString } from '../../utils/convertDuration';

import styles from './episode.module.scss';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
  description: string;
}

type EpisodeProps = {
  episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
  const router = useRouter();

  if (router.isFallback) { // se ele estiver em processo de carregamento
    <p>Peraí rapidinho...</p>
  }

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <Link href="/">
          <button type="button">
            <img src="/arrow-left.svg" alt="Voltar" />
          </button>
        </Link>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>

      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.durationAsString}</span>
      </header>
      {/* Descrição do podcast, forçar ele a mostrar o html da lista */}
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: episode.description }} />
    </div>
  )
}
// Quando a pagina é dinamica, ou seja, varios episodios usararão essse componente
export const getStaticPaths: GetStaticPaths = async () => {
  // buscar categorias mais acessadas
  const { data } = await api.get('episodes', {
    params: { //limite de quant retorando = 12, ordenar pela da de publicacao, em ordem decrescente  
      _limit: 2, // gerar as duas, de primeira
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const paths = data.map(path => {
    return {
      params: {
        slug: path.id
      }
    }
  })

  return {
    paths, // paths: paths a const lá de cima
    fallback: 'blocking'
    // false - se o episodio não for gerado no build, ele gera um 404
    // true - se não foi gerado, ele vai tentar buscar | executa do lado do browser, cliente
    // 'blocking' - buscar os dados na camada do next, melhor pra SEO
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params // passando o nome do episodio por paramentro

  const { data } = await api.get(`episodes/${slug}`)

  const episode = {
    id: data.id,
    title: data.title,
    thumbnail: data.thumbnail,
    members: data.members,
    publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }), // 8 jan 21
    duration: Number(data.file.duration),
    durationAsString: convertDurationToTimeString(Number(data.file.duration)),
    description: data.description,
    utl: data.file.url
  }

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}