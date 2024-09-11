import type { MarkdownInstance } from "astro";
import type { Frontmatter } from "../types";
import { slugifyStr } from "./slugify";

const countTagOccurrences = (posts: MarkdownInstance<Frontmatter>[], tag: string) => {
  const slugifiedTag = slugifyStr(tag);
  return posts.reduce((count, post) => {
    const postTags = post.frontmatter.tags.map(slugifyStr);
    return count + (postTags.includes(slugifiedTag) ? 1 : 0);
  }, 0);
};

export default countTagOccurrences;