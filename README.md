Readme
======

Readme for heithcock.com site using https://nextjs.org/[Vercel's Next.js]. (Formerly Ruby on Rails on Heroku - c.f. heithcockdotcom repo).

This needs to be at least a partially dynamic site as the /home pages require a /api/proxy.js for fetching rss
to get around the Cross-site scripting limitation (that is, javascript in a local page is prevented by the browser
from fetching rss from a different site.)

This then is two sites under the heithcock.com umbrella. My personal website and Suzy's /home/suzy version of iGoogle.

Development, testing and deploying
----------------------------------

To see the work in a local browser, choose a new terminal and type `npm run dev`.

To deploy, push using GitHub.

### Resizing images

To resize all images in a folder to a maximum width or height via the command line:

 cd <folder path>
 sips -Z 1000 *.jpg

(Note that this will make a 2000 x 1000 image 1000 x 500 and a 1000 x 2000 image 500 x 1000.)

JG's site
---------

The site is simlar to Suzy's elsworthartworks.com site, with a home page that lists out the categories of things I
want to show and under them, a gallery of connected items.

Suzy's site
-----------

Home pages for Suzy (/home/suzy) and others. This is the recreation of Googles iHome pages.

- [Tangerine](https://fonts.google.com/specimen/Tangerine) (headers)
- [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (serif)
- [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) (monospace)
- [Noto Sans Symbols 2](https://fonts.google.com/specimen/Noto+Sans+Symbols+2) (symbols)
