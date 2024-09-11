import React from 'react';
import slugify from "@utils/slugify";
import type { Frontmatter } from "src/types";

interface TagProps {
  name: string;
  children?: React.ReactNode; 
  count: number;
}

const Tag: React.FC<TagProps> = ({ name, children, count }) => {
  const slug = slugify({ title: name } as Frontmatter);
  return (
    <li className="inline-block mr-4 my-2">
    <a
      href={`/writeups/${slug}`}
      className="px-4 py-2 text font-bold bg-skin-card/20  uppercase text-skin-fill border border-skin-line hover:bg-skin-card shadow-custom relative hover:-top-0.5 focus-visible:p-1 flex items-center"
    >
      {children && <span className="icon-container mr-2">{children}</span>}
      <span>{name}</span>
      <span className="ml-2">({count})</span>
    </a>
  </li>
  );
};

export default Tag;