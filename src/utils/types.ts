export interface FastifyParams {
  tmdbId?: number;
  animeId?: string;
  anilistId?: number;
  malId?: number;
  episodeId?: string;
  mediaId?: string;
  tvmazeId?: number;
  sort?: string;
  genre?: string;
  country?: string;
}
export interface FastifyQuery {
  imdbId?: number;
  tvdbId?: string;
  year?: string;
  q?: string;
  type?: string;
  page?: number;
  perPage?: number;
  format?: string;
  category?: string;
  server?: string;
  provider?: string;
  timeWindow?: string;
  season?: string;
  episode?: number;
  country?: string;
  genre?: string;
  quality?: string;
}

export const IAMetaFormatArr = ['TV', 'MOVIE', 'SPECIAL', 'OVA', 'ONA', 'MUSIC'] as const;

export const IAnimeCategoryArr = ['TV', 'MOVIE', 'SPECIALS', 'OVA', 'ONA'] as const;

export const IAnimeSeasonsArr = ['WINTER', 'SPRING', 'SUMMER', 'FALL'] as const;

export const JSortArr = ['airing', 'bypopularity', 'upcoming', 'favorite', 'rating'] as const;
