import PostPreview from "./post-preview";
import styles from "../../styles/Main.module.css";

const FolderList = ({ posts }) => {
  return (
    <section>
      <div className={styles.folderList}>
        {posts.map((post) => (
          <PostPreview
            key={post.slug}
            title={post.title}
            coverImage={post.coverImage}
            date={post.date}
            author={post.author}
            slug={post.slug}
            excerpt={post.excerpt}
          />
        ))}
      </div>
    </section>
  );
};

export default FolderList;
