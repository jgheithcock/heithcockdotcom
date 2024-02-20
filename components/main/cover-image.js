import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Main.module.css";

const CoverImage = ({
  title,
  slug,
  coverImage: { src, alt, width, height },
}) => {
  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={true}
      className={styles.mapBorder}
    />
  );
  return <figure className={styles.coverImage}>{image}</figure>;
};

export default CoverImage;
