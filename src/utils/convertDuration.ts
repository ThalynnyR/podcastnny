export function convertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / 3600) //transformar em hora, (60*60) //Math.floor pra arredondar pra baixo
  const minutes = Math.floor((duration % 3600) / 60) //pegar quantos minutos sobram dividido por 60
  const seconds = duration % 60

  const timeString = [hours, minutes, seconds]
  .map(unit => String(unit).padStart(2, '0')) //unir um por um, se tiver só um numero ele acrescenta 0
  .join(':') //para unir tudo, ex: 12:08:50

  return timeString
} 