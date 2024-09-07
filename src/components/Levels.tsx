import React from 'react';

interface TagProps {
  level: string;
}

const Tag: React.FC<TagProps> = ({ level }) => {
  return (
    <li className="inline-block mr-4 my-2">
    <a
      href={`/tags/${level}`}
      className="px-4 py-2 text-sm bg-skin-card hover:bg-skin-card-muted rounded shadow-custom relative hover:-top-0.5 focus-visible:p-1 flex items-center"
    >
      <span>{level}</span>
    </a>
  </li>
  );
};

export default Tag;