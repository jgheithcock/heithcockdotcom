import styles from "../../styles/Main.module.css";
import { LeftArrowIcon, UpArrowIcon, RightArrowIcon, Icon } from "./icons";

const NavLinks = ({ parentPost, previousPost, nextPost = {} }) => {
  if (!parentPost) return null;
  return (
    <>
      <hr />
      <span className={styles.NavLinks}>
        {previousPost && (
          <span className={styles.prevBtn}>
            <LeftArrowIcon title={previousPost.title} url={previousPost.slug} />
          </span>
        )}
        {parentPost && (
          <span className={styles.upBtn}>
            <UpArrowIcon title={parentPost.title} url={parentPost.slug} />
          </span>
        )}
        {nextPost && (
          <span className={styles.nextBtn}>
            <RightArrowIcon title={nextPost.title} url={nextPost.slug} />
          </span>
        )}
      </span>
    </>
  );
};

export default NavLinks;
