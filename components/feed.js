import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Feed({ title, url, feed_type }) {
  return (
    <div className={styles.card}>
      <h2>
        <Link key={"url"} href={url}>
          {title}
        </Link>
      </h2>
      {feed_type}
    </div>
  );
}
