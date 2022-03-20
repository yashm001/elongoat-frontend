import Head from 'next/head'

const HeaderMeta = ({title}) => {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#000000' />
      <meta name='description' content='Elon Goat - Swap Tokens' />
      <link
        rel='apple-touch-icon'
        sizes='180x180'
        href='/apple-touch-icon.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='32x32'
        href='/favicon-32x32.png'
      />
      <link
        rel='icon'
        type='image/png'
        sizes='16x16'
        href='/favicon-16x16.png'
      />
      <link rel='manifest' href='/site.webmanifest' />
      <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
      <meta name='msapplication-TileColor' content='#fafafa' />
      <meta name='theme-color' content='#ffffff' />
      <title>{title}</title>
    </Head>
  )
}

export default HeaderMeta
