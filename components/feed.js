import styles from "../styles/Home.module.css";
import Link from "next/link";
import Content from "./content";

export default function Feed({ title, url, feed_type }) {
  return (
    <div className={styles.card}>
      <h2>
        <Link key={"url"} href={url}>
          {title}
        </Link>
      </h2>
      <Content url={url} feed_type={feed_type}></Content>
    </div>
  );
}
