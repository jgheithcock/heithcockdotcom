import Head from "next/head";
import Link from "next/link";
import { getAllHomePageIds } from "../../lib/homepages";
import { capitalizeWords } from "../../lib/utils";
import styles from "../../styles/Home.module.css";

export default function Home() {
  const allPageIds = getAllHomePageIds();
  const pages = allPageIds.map((pid) => (
    <a
      href={`/home/${pid.params.id}`}
      className={styles.card}
      key={pid.params.id}
    >
      <>
        <h2>{`${capitalizeWords(pid.params.id)}`}</h2>
        <p>{`${capitalizeWords(pid.params.id)}'s home page`}</p>
      </>
    </a>
  ));
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Home Pages</h1>

        <p className={styles.description}>Choose a person&rsquo;s home page.</p>

        <div className={styles.grid}>{pages}</div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
