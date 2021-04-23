import Document, { Html, Head, Main, NextScript } from 'next/document';
// customizar o html, ao redor de toda a aplicação 
// porém chamado só uma vez

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&family=Lexend:wght@500;600&display=swap" rel="stylesheet"/>
        </Head>
        <body>
          <Main />{/* //Fica no aplicação */}
          <NextScript /> {/* Toda a injecao de script next pra funcionar*/}
        </body>
      </Html>
    );
  }
}