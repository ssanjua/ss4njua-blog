import React from 'react';
import slugify from "@utils/slugify";
import type { Frontmatter } from "src/types";

interface TagProps {
  name: string;
  size?: "sm" | "lg";
  children?: React.ReactNode; // Añadir esta línea
}

const Tag: React.FC<TagProps> = ({ name, size = "sm", children }) => {
  const slug = slugify({ title: name } as Frontmatter);
  return (
    <li className="inline-block mr-4 my-2">
    <a
      href={`/writeups/${slug}`}
      className="px-4 py-2 text-sm bg-skin-card hover:bg-skin-card-muted rounded shadow-custom relative hover:-top-0.5 focus-visible:p-1 flex items-center"
    >
      {children && <span className="icon-container mr-2">{children}</span>}
      <span>{name}</span>
    </a>
  </li>
  );
};

export default Tag;