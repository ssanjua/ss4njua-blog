import Fuse from "fuse.js";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import type { Frontmatter } from "@utils/types";

interface Props {
  searchList: {
    title: string;
    description: string;
    frontmatter: Frontmatter;
    slug: string;
  }[];
}

interface SearchResult {
  item: {
    title: string;
    description: string;
    frontmatter: Frontmatter;
    slug: string;
  };
  refIndex: number;
}

export default function SearchBar({ searchList }: Props) {
  const [inputVal, setInputVal] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(
    null
  );

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = new Fuse(searchList, {
    keys: ["title", "description"],
    includeMatches: true,
    threshold: 0.3,
  });

  useEffect(() => {
    setSearchResults(fuse!.search!(inputVal!));
  }, [inputVal]);

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg">
            <path d="M19.023 16.977a35.13 35.13 0 0 1-1.367-1.384c-.372-.378-.596-.653-.596-.653l-2.8-1.337A6.962 6.962 0 0 0 16 9c0-3.859-3.14-7-7-7S2 5.141 2 9s3.14 7 7 7c1.763 0 3.37-.66 4.603-1.739l1.337 2.8s.275.224.653.596c.387.363.896.854 1.384 1.367l1.358 1.392.604.646 2.121-2.121-.646-.604c-.379-.372-.885-.866-1.391-1.36zM9 14c-2.757 0-5-2.243-5-5s2.243-5 5-5 5 2.243 5 5-2.243 5-5 5z"></path>
          </svg>
        </span>
        <input
          className="placeholder:italic placeholder:text-opacity-75 py-3 pl-10 pr-3 
        block bg-skin-fill w-full rounded
        border border-skin-fill border-opacity-40 
        focus:outline-none focus:border-skin-fill"
          placeholder="Search for anything..."
          type="text"
          name="search"
          defaultValue={inputVal}
          onChange={handleChange}
          autoComplete="off"
        />
      </label>

      {inputVal.length > 1 && (
        <div className="mt-8">
          Found {searchResults?.length}
          {searchResults?.length && searchResults?.length > 1
            ? " results"
            : " result"}{" "}
          for '{inputVal}'
        </div>
      )}

      <ul>
        {searchResults &&
          searchResults.map((result) => (
            <Card
              post={result.item.frontmatter}
              href={`/posts/${result.item.slug}`}
              key={`${result.refIndex}-${result.item.slug}`}
            />
          ))}
      </ul>
    </>
  );
}