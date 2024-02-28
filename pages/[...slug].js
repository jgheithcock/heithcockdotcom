import Head from "next/head";
import FolderList from "../components/main/folder-list";
import Layout from "../components/main/layout";
import { getPosts, getAllPosts, getPostBySlug } from "../lib/mainpages";
import markdownToHtml from "../lib/markdownToHtml";
import DateFormatter from "../components/main/date-formatter";

export default function Slug(params) {
  // this handles both Folders as well as Files
  // console.log("Slug: params ->", params);
  const { parent, post, children } = params;
  const titlePrefix =
    parent && parent.title !== post.title ? `${parent.title} - ` : "";
  return (
    <Layout>
      <Head>
        <title>{`${titlePrefix}${post.title}`}</title>
        <meta property="og:image" content={post.ogImage.url} />
        <meta name="description" content={post.excerpt} />
      </Head>
      <h1>{post.title}</h1>
      <DateFormatter dateString={post.date} />
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="markdown"
      />
      {children && children.length > 0 && (
        <div>
          <hr />
          <FolderList posts={children} />
        </div>
      )}
    </Layout>
  );
}
export async function getStaticProps({ params }) {
  const parentSlug = params.slug.slice(0, -1).join("/");
  const parentPost = parentSlug ? getPostBySlug(parentSlug, ["title"]) : null;
  const slugURL = params.slug.join("/");
  console.log("Slug:getStaticProps: slug = ", slugURL);
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
      parent: parentPost,
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
