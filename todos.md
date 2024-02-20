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
  url: "/images/replacement-pawn.jpeg"
---

# Todos

## Footnotes

No native footnote support in remark-html. I like Shamus's style, below. His uses some javascript that, when .snote_refnum is clicked, toggles the .snote_tip visibility.

```
### html
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
