import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Main.module.css";

export const Icon = ({
  url,
  imageUrl,
  title,
  isTextButton = true,
  iconOnLeft = true,
  width = 32,
  height = 32,
}) => {
  console.log("url =", `/images/${imageUrl}`);
  return (
    <Link key={url} href={url} legacyBehavior>
      <a>
        <Image
          alt={title}
          src={`/images/${imageUrl}`}
          width={width}
          height={height}
          priority={true}
        />
        {isTextButton && title}
      </a>
    </Link>
  );
};

export const IconButton = ({ icon, url, title, isTextButton = true }) => {
  if (!url) return <>{title}</>;
  return (
    <Link key={url} href={url} legacyBehavior>
      <a className={styles.iconButton}>
        <span className="symbol">{icon}</span>
        {isTextButton && <label>{title}</label>}
      </a>
    </Link>
  );
};
export const RightArrowIcon = (params) => <IconButton icon={"⮚"} {...params} />;

export const UpArrowIcon = (params) => <IconButton icon={"⮙"} {...params} />;

export const LeftArrowIcon = (params) => <IconButton icon={"⮘"} {...params} />;
