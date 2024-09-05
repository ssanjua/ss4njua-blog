import React from 'react';
import slugify from "../utils/slugify";

interface TagProps {
  name: string;
  size?: "sm" | "lg";
}

const Tag: React.FC<TagProps> = ({ name, size = "sm" }) => {
  const slug = slugify(name);
  
  return (
    <li className={`inline-block mr-2 my-2 ${size === "sm" ? "my-1" : "my-3"}`}>
      <a
        href={`/tags/${slug}`}
        className={`${size === "sm" ? "py-1 px-2 text-xs" : "p-2 text-sm"} bg-skin-card hover:bg-skin-card-muted rounded shadow-custom relative hover:-top-0.5 focus-visible:p-1`}
      >
        <span>{name}</span>
      </a>
    </li>
  );
};

export default Tag;