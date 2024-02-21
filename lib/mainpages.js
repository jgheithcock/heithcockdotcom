import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { error } from "console";

const postsDirectory = join(process.cwd(), "_posts");
const markdownExtension = ".md";
const indexPath = "/index" + markdownExtension;

function pathToSlug(path) {
  // cheap URL sanitizer: this assumes file and folder names do not have
  // illegal characters and just strips off any extension and removes the postsDirectory
  return path.slice(postsDirectory.length + 1).replace(/\..+$/, "");
}

function slugToPath(slug) {
  const folderPath = join(postsDirectory, slug, indexPath);
  if (fs.existsSync(folderPath)) return folderPath;
  const filePath = join(postsDirectory, slug + markdownExtension);
  if (fs.existsSync(filePath)) return filePath;
  /* console.log(
    "Err: slugToPath: no path found for folderPath '",
    folderPath,
    "' nor filePath '",
    filePath,
    "'"
  );
  */
  return "";
}

function scanDir(startPath, filter, recurse = false) {
  const contents = [];
  if (!fs.existsSync(startPath)) {
    return contents;
  }

  const files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var path = join(startPath, files[i]);
    var stat = fs.lstatSync(path);
    if (stat.isDirectory()) {
      contents.push({
        type: "folder",
        name: files[i],
        path: path,
        slug: pathToSlug(path),
      });
      if (recurse) contents.push(...scanDir(path, filter, recurse));
    } else if (path.endsWith(filter) && !path.endsWith(indexPath)) {
      console.log("scanDir - file => ", path);
      contents.push({
        type: "file",
        name: files[i],
        path: path,
        slug: pathToSlug(path),
      });
    }
  }
  return contents;
}

const defaultTitle = (slug) => titleCase(slug) || "Unknown";

function mapDataToPost(slug, data, content, fields) {
  const items = {};
  if (typeof fields === "undefined") {
    error("mapDataToPost: missing required fields for ", slug);
    return items;
  }

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === "slug") {
      items[field] = slug;
    } else if (field === "content") {
      items[field] = content;
    } else if (
      typeof data !== "undefined" &&
      typeof data[field] !== "undefined"
    ) {
      items[field] = data[field];
    } else {
      // sub in missing data with defaults
      const lastSlugItem = slug.split("/").slice(-1)[0];
      if (field === "title") items[field] = defaultTitle(lastSlugItem);
      else if (field === "ogImage") items[field] = {};
      else if (field === "coverImage") items[field] = {};
      else items[field] = "";
    }
  });
  return items;
}

export function getPostBySlug(slug, fields = []) {
  const filePath = slugToPath(slug);
  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const post = mapDataToPost(slug, data, content, fields);
    // console.log("getPostBySlug: post = ", post);
    return post;
  } catch (err) {
    if (filePath !== "")
      // not an error for empty dirs
      console.log("getPostBySlug(", slug, ") couldn't read file at ", filePath);
    const post = mapDataToPost(slug, {}, "", fields);
    // console.log("getPostBySlug(", slug, "): post = ", post);
    return post;
  }
}

export function getAllPosts() {
  // needed by getStaticPaths()
  return scanDir(postsDirectory, markdownExtension, true);
}

export function getPosts(slug, fields = []) {
  const contents = scanDir(join(postsDirectory, slug), markdownExtension);
  const posts = contents
    .map((item) => getPostBySlug(item.slug, fields))
    .filter((n) => n && n.slug !== "unpublished") // remove empty items
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getHeroPost(posts) {
  return {
    title: "A replacement pawn",
    slug: "the-fire",
    date: "2024-01-08",
    excerpt:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis harum tenetur repudiandae rem, odit animi consequatur impedit dolorem suscipit sit.",
    coverImage: {
      src: "/images/replacement-pawn.jpeg",
      alt: "White pawn carved from a cork",
      width: 1400,
      height: 1134,
    },
  };
}
/*
 * titleCase - based off of Title Caps by John Resig
 *
 * Ported to JavaScript By John Resig - http://ejohn.org/ - 21 May 2008
 * Original by John Gruber - http://daringfireball.net/ - 10 May 2008
 * License: http://www.opensource.org/licenses/mit-license.php
 */

export function titleCase(str) {
  const small =
    "(a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|v[.]?|via|vs[.]?)";
  const punct = "([!\"#$%&'()*+,./:;<=>?@[\\\\\\]^_`{|}~-]*)";

  function titleCaps(title) {
    var parts = [],
      split = /[:.;?!] |(?: |^)["Ò]/g,
      index = 0;

    while (true) {
      var m = split.exec(title);

      parts.push(
        title
          .substring(index, m ? m.index : title.length)
          .replace(/\b([A-Za-z][a-z.'Õ]*)\b/g, function (all) {
            return /[A-Za-z]\.[A-Za-z]/.test(all) ? all : upper(all);
          })
          .replace(RegExp("\\b" + small + "\\b", "ig"), lower)
          .replace(
            RegExp("^" + punct + small + "\\b", "ig"),
            function (all, punct, word) {
              return punct + upper(word);
            }
          )
          .replace(RegExp("\\b" + small + punct + "$", "ig"), upper)
      );

      index = split.lastIndex;

      if (m) parts.push(m[0]);
      else break;
    }

    return parts
      .join("")
      .replace(/ V(s?)\. /gi, " v$1. ")
      .replace(/(['Õ])S\b/gi, "$1s")
      .replace(/\b(AT&T|Q&A)\b/gi, function (all) {
        return all.toUpperCase();
      });
  }

  function lower(word) {
    return word.toLowerCase();
  }

  function upper(word) {
    return word.substr(0, 1).toUpperCase() + word.substr(1);
  }
  return titleCaps(str);
}
