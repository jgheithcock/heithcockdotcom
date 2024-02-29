---
title: "Test Markdown"
excerpt: "Test basic and extended markdown."
coverImage: "/assets/misc/markdown.jpg"
date: "2024-01-08"
author:
  name: JG Heithcock
  picture: "/assets/blog/authors/jg.jpg"
ogImage:
  url: "/assets/misc/markdown.jpg"
---

Test basic and extended markdown. [Markdown Cheatsheet](https://www.markdownguide.org/cheat-sheet/)

## Image

![A picture of Bob, the Guard at Gringotts](/images/bob-the-guard.jpeg)

Note: None of the possible extensions work for setting image width. The one possibility is, in the global.css file:

```
img[alt="A picture of Bob, the Guard at Gringotts"] {
    width: 400px;
}
```

HTML works:

<img src="/images/bob-the-guard.jpeg" alt="drawing" width="200"/>

<img src="/images/ink-cloud-trans.png" alt="Sun Logo" width="400" />

## Block Quote

> It was a fine day...

## Code...

The variable was named `foobar` - much thought had gone into its name.

## Internal comments

The following sentence is a comment (and is not visible):

[This is an internal comment]: #

## Admonitions

> [!NOTE]
> Admonitions are through the
> [remark-github-beta-blockquote-admonitions](https://www.npmjs.com/package/remark-github-beta-blockquote-admonitions)
> plugin and have limited functionality.
> Tags include `NOTE`, `IMPORTANT`, `WARNING`, `CAUTION`, `TIP` but there is no difference in the HTML rendered.
> The structure of the DOM is
>
> ```
> \<div class='admonition'>
>     \<p class='admonition-title'>...\</p>
>     \<p>...\</p>
> \</div>
> ```

> [!TIP]
> The **content** can ~~have~~ include _Markdown_ `syntax`. Check [this `api`](#).

## My list

Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officiis harum tenetur repudiandae rem, odit animi consequatur impedit dolorem suscipit sit, cum at molestiae reiciendis vel numquam ullam, dolores natus. Accusamus.

## Footnotes

Here's a sentence with a footnote. [^1]

## Lists

1. One
2. Two
3. Three

(Definition lists still not supported)

Term
: definition

(Task lists supported but with bullets still. \<UL> element has `contains-task-list` class which is used to remove them.)

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

That is so funny! :joy:

I need to highlight these ==very important words==.

H~2~O

X^2^

## Testing HTML (no)

<span class="Test">What?</span>

### Pluto

**Pluto** (minor-planet designation: **134340 Pluto**) is a
[dwarf planet](https://en.wikipedia.org/wiki/Dwarf_planet) in the
[Kuiper belt](https://en.wikipedia.org/wiki/Kuiper_belt).

[^1]: This is the footnote.

---

## code fencing

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```
