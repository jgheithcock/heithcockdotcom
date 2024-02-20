import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import Link from "next/link";
import styles from "../../styles/Main.module.css";

const PostPreview = ({ title, coverImage, date, excerpt, author, slug }) => {
  /*
  console.log(
    `PostPreview: title: ${title}, slug: ${slug}, coverImage: ${coverImage}, excerpt: ${excerpt}, date: ${date}`
  );
  */
  return (
    <div className={styles.postPreview}>
      {coverImage && (
        <CoverImage title={title} slug={slug} coverImage={coverImage} />
      )}
      <h3 className="text-3xl mb-3 leading-snug">
        <Link as={`/${slug}`} href="/[...slug]">
          {title}
        </Link>
      </h3>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p className={styles.excerpt}>{excerpt}</p>
    </div>
  );
};

export default PostPreview;
