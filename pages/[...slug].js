import Head from "next/head";
import FolderList from "../components/main/folder-list";
import Layout from "../components/main/layout";
import {
  getPosts,
  getNavPosts,
  getAllPosts,
  getPostBySlug,
} from "../lib/mainpages";
import markdownToHtml from "../lib/markdownToHtml";
import DateFormatter from "../components/main/date-formatter";

export default function Slug(params) {
  // this handles both Folders as well as Files
  // console.log("Slug: params ->", params);
  const { parentPost, previousPost, nextPost, post, children } = params;
  const hasChildren = children && children.length > 0;
  const articleClass = children && children.length > 2 ? "folder" : "single";
  const titlePrefix =
    parentPost && parentPost.title !== post.title
      ? `${parentPost.title} - `
      : "";
  return (
    <Layout
      parentPost={parentPost}
      previousPost={previousPost}
      nextPost={nextPost}
    >
      <Head>
        <title>{`${titlePrefix}${post.title}`}</title>
        <meta property="og:image" content={post.ogImage.url} />
        <meta name="description" content={post.excerpt} />
      </Head>
      <article className={articleClass}>
        <h1>{post.title}</h1>
        <DateFormatter dateString={post.date} />
        <div
          dangerouslySetInnerHTML={{ __html: post.content }}
          className="markdown"
        />
        {hasChildren && (
          <div>
            <hr />
            <FolderList posts={children} />
          </div>
        )}
      </article>
    </Layout>
  );
}
export async function getStaticProps({ params }) {
  const slugURL = params.slug.join("/");
  console.log("Slug:getStaticProps: slug = ", slugURL);
  const { parentPost, previousPost, nextPost } = getNavPosts(params.slug);
  const post = getPostBySlug(slugURL, [
    "title",
    "name",
    "type",
    "date",
    "slug",
    "author",
    "content",
    "ogImage",
    "coverImage",
    "excerpt",
  ]);
  // console.log("Slug:post: ", post);
  const subPosts = getPosts(slugURL, [
    "title",
    "type",
    "date",
    "slug",
    "author",
    "coverImage",
    "excerpt",
  ]);
  // console.log("Slug:subPosts: ", subPosts);
  const content = await markdownToHtml(post.content);

  return {
    props: {
      parentPost: parentPost,
      previousPost: previousPost,
      nextPost: nextPost,
      post: {
        ...post,
        content,
      },
      children: subPosts,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["slug"], true).map((post) => post.slug);
  // console.log("getStaticPaths: posts => ", posts);
  return {
    paths: posts.map((post) => {
      return {
        params: {
          slug: post.split("/"),
        },
      };
    }),
    fallback: false,
  };
}
