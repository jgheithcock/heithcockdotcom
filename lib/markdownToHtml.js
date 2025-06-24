import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeFormat from "rehype-format";
import rehypeRaw from "rehype-raw";
import rehypeRewrite from "rehype-rewrite";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGFM from "remark-gfm";
import remarkAdmonitions from "remark-github-beta-blockquote-admonitions";
import remarkSmartypants from "remark-smartypants";
import { unified } from "unified";
import { visit } from "unist-util-visit";

export default async function markdownToHtml(markdown) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGFM)
    .use(remarkToc)
    .use(remarkAdmonitions)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeFormat)
    .use(rehypeRaw)
    .use(remarkSmartypants, { dashes: "oldschool" })
    .use(rehypeSlug)
    .use(rehypeStringify)
    .use(rehypeRewrite, {
      // Rewrite text in links for the 'ink cloud' hover effect.
      selector: "a:not(:has(img))", // Only links without images are considered.
      rewrite: (node) => {
        /*
          Create span elements for each character in the link text.
          Inline css variables into style:
          d: animation-delay (%): Leftmost character is 100%, going down to 0, back to 100%
          pos: 0-1 (for positioning smoke)
          dx,dy: random -1 - +1 - for adjusting distance travelled by smoke bubbles
          ax: random -0.5 - +0.5 - for adjusting delay of :after smoke bubble
        */
        const build = (delay, pos, char) => {
          const dx = 2 * Math.random() - 1,
            dy = 2 * Math.random() - 1,
            ax = (2 * Math.random() - 1) / 5;
          return {
            type: "element",
            tagName: "span",
            properties: {
              style: `--d:${delay};--p:${pos};--dx:${dx};--dy:${dy};--ax:${ax}`,
            },
            children: [{ type: "text", value: char }],
          };
        };
        if (node.type === "element") {
          // test needed for typescript compliance
          visit(
            node,
            "text",
            function (n, index, parent) {
              const { value } = n; /* the text in the link */
              const len = value.length;
              const median = (1 + len) / 2;
              // medRem is to make sure the center numbers are zero (for no delay)
              const medRem = median - Math.floor((1 + len) / 2);
              let spanned = [];
              const extra = value.length % 2 ? 0 : -1;
              for (let ndex = 0; ndex < value.length; ndex++) {
                const d = Math.abs((1 + ndex - median) / median - medRem);
                const p = ndex / len;
                spanned.push(build(d, p, value[ndex]));
              }
              parent.children.splice(index, 1, ...spanned);
            },
            true
          );
        }
      },
    })
    .process(markdown);

  return result.toString();
}
