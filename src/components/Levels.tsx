import React from 'react';

interface TagProps {
  level: string;
  count: number;
  icon: string;
}

const Tag: React.FC<TagProps> = ({ level, count, icon }) => {
  return (
    <li className="inline-block mr-4 my-4">
    <a
      href={`/tags/${level}`}
      className="px-4 py-2 text-sm border border-skin-line bg-skin-card/40 hover:bg-skin-card-muted shadow-custom relative hover:-top-0.5 focus-visible:p-1 flex items-center"
    >
      <span className="uppercase font-bold">{level}</span> 
      <span className="ml-1">{icon}</span>
      <span className="font-bold">({count})</span>
    </a>
  </li>
  );
};

export default Tag;