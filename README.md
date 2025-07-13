Heithcock.com
=============

Source code for the [heithcock.com](https://www.heithcock.com/) website. Built
with [Vercel's Next.js](https://nextjs.org/). The blog pages used the [Vercel
Blog Starter Kit](https://vercel.com/templates/next.js/blog-starter-kit) as a
starting spot.

Site guide
----------

This is effectively two sites glued at the hip. The main blog site uses
components from *main*, all pages starting with '/home/' use components from the
*home*. The */home/* pages are a reverse engineering of Google's [iGoogle web
portal](https://en.wikipedia.org/wiki/IGoogle). These use /api/proxy.js to
fetch rss. This is to get around the Cross-site scripting limitation (that is,
javascript in a local page is prevented by the browser from fetching rss from a
different site.)

This, then, is two sites under the heithcock.com umbrella. My personal, static,
website and my wife's version of iGoogle.

Posts
-----

Posts are stored as markdown files in the `_posts` folder. Each subfolder is
displayed as a folder-list page, where data from the markdown's front-matter is
used to create a summary. If the folder contains an `index.md` file, its
contents is used to create a summary above the folder listing. Folders can have
sub-folders *ad infinitum*.

Notes on use of Markdown
------------------------

This uses [gray-matter](https://github.com/jonschlinkert/gray-matter) as does
the [Blog Starter Kit](https://vercel.com/templates/next.js/blog-starter-kit)
to parse front-matter from the beginning of each markdown post. This data is
used by the components in main to show folder lists of posts with titles, dates,
cover images etc. The data is also used in the `[...slug].js` page for meta
data such as the title, date, and Open Graph data for showing a preview in text
messages. See `lib/mainpages.js` for details.

The `markdownToHtml` method in *lib/markdownToHtml.js* uses a number of
[Rehype](https://github.com/remarkjs/remark-rehype) plugins. The one remarkable
note is using rehypeRewrite to convert markdown links to be displayed as *smoke*
links (see the [test](https://www.heithcock.com/unpublished/misc/test)
page).

Testing and deploying
---------------------

To get started, clone this repo to your local machine, cd to it and type `npm
install`

To view in a local browser, type `npm run dev` in a terminal window.

To deploy, push using GitHub.

Tips and Tools
--------------

### Resizing images

To resize all images in a folder to a maximum width or height via the command
line:

 cd <folder path>
 sips -Z 1000 *.jpg

 For recursively processing all sub-folders
 find . -type f -iname "*.jpg" -exec sips -Z 1000 {} --out "{}" \;

(Note that this will make a 2000 x 1000 image 1000 x 500 and a 1000 x 2000 image
500 x 1000.)

Google fonts used
-----------------

- [Tangerine](https://fonts.google.com/specimen/Tangerine) (headers)
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)
(serif)
- [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (monospace)
- [Noto Sans Symbols 2](https://fonts.google.com/specimen/Noto+Sans+Symbols+2)
(symbols)
