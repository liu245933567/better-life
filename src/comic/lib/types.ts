export interface ComicBase {
  /** 动漫 id  */
  originHref: string;
  name: string;
  /** 动漫头像 */
  portraitUrl: string;
}

interface ChapterInfo {
  originHref: string;
  name: string;
}

export interface ComicDetail extends ComicBase {
  chapters: ChapterInfo[];
}
