import Head from "next/head";
import styles from "../styles/Main.module.css";
import Layout from "../components/main/layout";

export default function Custom404() {
  return (
    <Layout>
      <Head>
        <title>The Curmudgeonly Codger</title>
      </Head>
      <div className={styles.error}>
        <h1>404</h1>
        <p>Page Not Found</p>
      </div>
    </Layout>
  );
}
