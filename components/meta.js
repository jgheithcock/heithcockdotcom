import Head from "next/head";

// ### TODO: c.f. https://ogp.me/ and https://www.imdb.com/title/tt0117500/ for examples of
// adding more meta data
// ### Also, maybe split out favicon logic?
const Meta = ({ favFolder }) => {
  const subFolder = favFolder ? `${favFolder}/` : "";
  return (
    <Head>
      <link rel="icon" href={`/favicon/${subFolder}favicon.ico`} />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`/favicon/${subFolder}apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`/favicon/${subFolder}icon-32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`/favicon/${subFolder}icon-16.png`}
      />
      <link rel="manifest" href={`/favicon/${subFolder}manifest.webmanifest`} />
      <link
        rel="mask-icon"
        href={`/favicon/${subFolder}safari-pinned-tab.svg`}
        color="#000000"
      />
      <link rel="shortcut icon" href={`/favicon/${subFolder}favicon.ico`} />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />

      {/*  Look at Brian and MWD's meta list */}
      <meta name="author" content="JG Heithcock" />
      <meta
        name="description"
        content="JG Heithcock's personal web site cataloging the odd things he does"
      />
    </Head>
  );
};

export default Meta;
