import Datetime from "./Datetime";
import type { Frontmatter } from "@utils/types";
import Tag from "./Tag";

export interface Props {
  href?: string;
  post: Frontmatter;
  secHeading?: boolean;
}

export default function Card({ href, post, secHeading = true }: Props) {
  const styles = {
    cardContainer: "mt-6",
    titleLink:
      "text-skin-accent font-medium text-lg",
    titleHeading: "font-medium text-lg hover:text-skin-base transition-all hover:scale-205",
  };

  return (
    <li className={styles.cardContainer}>
      <a href={href} className={styles.titleLink}>
        {secHeading ? (
          <h2 className={styles.titleHeading}>{post.title}</h2>
        ) : (
          <h3 className={styles.titleHeading}>{post.title}</h3>
        )}
      </a>
      <Datetime datetime={post.datetime} />
      <div>
        {post.tags.map(tag => (
          <Tag name={tag} />
        ))}
      </div>
      {/* <div className={styles.tagsWrapper}>
        {post.tags.map(tag => (
          <p className={styles.tagText}>{tag}</p>
        ))}
      </div> */}
      <p>{post.description}</p>
    </li>
  );
}