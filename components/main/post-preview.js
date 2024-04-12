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
      <Link as={`/${slug}`} href="/[...slug]">
        <a>
          <CoverImage title={title} slug={slug} coverImage={coverImage} />
        </a>
      </Link>
      <Link as={`/${slug}`} href="/[...slug]">
        <span className={"markdown"}>
          <a>{title}</a>
        </span>
      </Link>
      <div className="text-lg mb-4">
        <DateFormatter dateString={date} />
      </div>
      <p
        dangerouslySetInnerHTML={{ __html: excerpt }}
        className={styles.excerpt}
      />
    </div>
  );
};

export default PostPreview;
