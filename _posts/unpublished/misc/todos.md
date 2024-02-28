---
title: "Todos"
excerpt: "A never ending list."
coverImage:
  src: "/images/replacement-pawn.jpeg"
  alt: "White pawn carved from a cork"
  width: 1400
  height: 1134
date: "2024-01-15"
publish: false
author:
  name: JG Heithcock
  picture: "/images/bob-the-guard.jpeg"
ogImage:
  url: "/images/bob-the-guard.jpeg"
---

## Contents

## Navigation

Need to:

0. Fix link styling - Not happy with the current underlines - don't like full underlines but no underline is too hidden. Also header isn't all that obvious.
   - Check out https://codepen.io/giuliamalaroda/pen/QBOGdG - but have gradient go from dark to transparent on the ends. Ideally, it would be an ink blob.
1. Decide on what kind of navigation to have:

   - Breadcrumbs?
   - Just a hamburger menu (it could unfold like the marauder's map but is that two clicks for iPad?)
   - Also a regular menu either on the top or as a sidebar? (Kind of not going for that but maybe a footer with About)
   - Next/Previous links (and get around breadcrumbs by having an Up icon (that takes you to the parent))

2. Implement

## TOC [**DONE**]

(Note: Needed to use `rehypeSlug` to add ids to the headers _after_ `rehypeFormat`

Asciidoc has a nice Table of Contents mechanism:

```
:toc:
:toc-placement!:

Here is my preamble paragraph, but I could really place the TOC anywhere! Lorem ipsum forever....
toc::[]
```

Looks like there is a plugin already: [remark-toc](https://github.com/remarkjs/remark-toc). This seems exactly what the Doctor ordered as you can control the depth and also it is just markdown for where to put the contents.

## Footnotes [**DONE**]

(Note: this was fixed as part of using [`remarkGFM`](https://github.com/remarkjs/remark-gfm) which supports [Github Flavored Markdown](https://github.github.com/gfm). See [the test page](test#footnotes) for an example.)

Implement some type of [footnotes](<https://en.wikipedia.org/wiki/Note_(typography)>) as there is no [native footnote support](https://www.markdownguide.org/cheat-sheet/) in remark-html. I'm not wild about the need in markdown in any case that you need to manually place both the footnote as

I like [Shamus's style of footnotes](https://www.shamusyoung.com/twentysidedtale/?p=53140), below. His uses some javascript that, when .snote_refnum is clicked, toggles the .snote_tip visibility. (As it turns out, he apparently got the idea for this style from [XKCD “What-if?” series](https://what-if.xkcd.com/96/))

### html

```
<span class="snote" title="2" style="display: inline-block;">
    <span class="snote_refnum" title="">[2]</span>
    <span class="snote_tip" id="snote_1">I’m well aware this is a fun job.</span>
</span>

<!-- and then at the bottom -->

<div class="entry-footnotes">
    <h4>Footnotes:</h4>
    <p>[1] This is redundant. Ad-hoc is the only kind of PHP you can write.</p>
    <p>[2] I’m well aware this is a fun job.</p>
    <p>[3] Less than a dollar, and most of the money gets eaten in transaction fees. Credit card companies HATE tiny transactions.</p>
</div>
```

### css

```
.snote_refnum {
    position: relative; /* this and the bottom below is to make it a superscript. Perhaps superscript wasn't widely supported then? */
    bottom: 1ex;
    font-size: .7em; /* Again, superscript */
    color: #069;
    font-weight: bold;
    text-decoration: underline; /* personally, this seems a bit cluttered */
    cursor: help;
}

.snote_tip {
    font-size: smaller;
    display: inline-block;
    visibility: hidden;
    position: absolute;
    overflow: hidden;
    padding: 0.5em;
    background: #fea;
    color: #000000;
    border: 2px solid #874;
    box-shadow: 0.25em 0.25em 0.25em #555;
    z-index: 1;
    max-width: 50%; /* not clear to me what this does pos:absolute makes this all on a single line in Chrome anyway. */
}
```

## Images

Basic Markdown, and thus Remark, has very primitive support for images. Would be nice to have support for sizing at least. See [the test page](test). Also see [Next's Optimizing Images](https://nextjs.org/docs/pages/building-your-application/optimizing/images).

## Time/Date stamps

The site uses some elementary styling for \<time> but it would be nice to do more support (like tags?). See [HTML: time element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)

## Logging

At this point, less need, but check out https://www.meticulous.ai/blog/getting-started-with-react-logging

## Cool things

I should try to not get distracted by the following:

### Footsteps

How cool to have footsteps actually walking around?

### Fluttering banners

Very much an edge case (as we really do not want to publish pages with missing images).

### More complexity with borders

Maybe alternating odd/even for lowercase/uppercase for each child.
