import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/Main.module.css";

const CoverImage = ({ title, slug, coverImage }) => {
  const missingImage = {
    src: "/images/image-missing-feet.png",
    alt: "This image was missing",
    width: 1022,
    height: 1022,
  };
  const img = { ...missingImage, ...coverImage };
  const image = (
    <Image
      src={img.src}
      alt={img.alt}
      width={img.width}
      height={img.height}
      priority={true}
      className={styles.mapBorder}
    />
  );
  return <figure className={styles.coverImage}>{image}</figure>;
};

export default CoverImage;
