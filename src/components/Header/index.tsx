import styles from './styles.module.scss';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';

export function Header() {
  // lib date-dns pra formatar data format Brasil
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR,
  });

  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastnny"/>

      <p>Quer ouvir de tudo e um pouco mais ? Veeem!</p>
      <span>{currentDate}</span>
    </header>
  );
}