import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function HomePageLayout({ title, theme, children }) {
  const columns = children.map((col, ndx) => (
    <div key={ndx} className={styles.column}>
      {col}
    </div>
  ));
  return (
    <div className={styles[theme]}>
      <Head>
        <title>{title}</title>
      </Head>
      <h1 className={styles.header}>{title}</h1>
      <div className={styles.grid}>{columns}</div>
    </div>
  );
}
