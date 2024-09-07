export interface Frontmatter {
  title: string;
  description: string;
  author: string;
  datetime: string;
  slug: string;
  featured: boolean;
  tags: string[];
  ogImage?: string;
}

export type SocialsObject = {
  name: SocialMedia;
  href: string;
  active: boolean;
}[];

export type SocialIcons = {
  [social in SocialMedia]: string;
};

export type SocialMedia =
  | "Github"
  | "Facebook"
  | "Instagram"
  | "Linkedin"
  | "Mail"
  | "Twitter"
  | "Twitch"
  | "YouTube"
  | "WhatsApp"
  | "Snapchat"
  | "Pinterest"
  | "TikTok"
  | "CodePen"
  | "Discord"
  | "GitLab"
  | "Reddit"
  | "Skype"
  | "Steam"
  | "Telegram"
  | "Linktree"
  | "HackTheBox";