import styles from "../../styles/Home.module.css";
import Link from "next/link";
import Content from "./content";

export default function Feed({ feed_id, title, url, ...props }) {
  return (
    <div className={`${styles.card} ${feed_id}`}>
      <h2>
        <Link key={"url"} href={url}>
          {title}
        </Link>
      </h2>
      <Content url={url} {...props}></Content>
    </div>
  );
}
