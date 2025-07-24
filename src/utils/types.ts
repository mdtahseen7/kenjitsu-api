export interface FastifyParams {
  tmdbId?: number;
  season?: string;
  year?: string;
  animeId?: string;
  anilistId?: number;
  malId?: number;
  episodeId?: string;
  episodeNumber?: number;
  mediaId?: string;
  tvmazeId?: number;
  seasonNumber?: number;
}
export interface FastifyQuery {
  imdbId?: number;
  tvdbId?: string;
  q?: string;
  type?: string;
  page?: number;
  perPage?: number;
  format?: string;
  category?: string;
  server?: string;
  provider?: string;
  timeWindow?: string;
}
type KaiEpisodes = {
  episodeNumber: number;
  rating?: number;
  aired?: boolean;
  episodeId: string;
  title: string;
  overview?: string;
  thumbnail?: string;
};
type KaiInfo = {
  animeId: string;
  title: string;
  posterImage: string;
  romaji: string;
  status: string;
  type: string;
  synopsis: string;
  episodes: {
    sub: number;
    dub: number;
  };
  totalEpisodes: number;
};
export type AnimekaiInfo = {
  providerEpisodes: KaiEpisodes[];
  data: KaiInfo;
};
type provider = {
  animeId: string;
  name: string;
  romaji: string;
  score: number;
  providerName: string;
};
export type AnilistInfo = {
  data: AnilistData;
  animeProvider?: provider;
  providerEpisodes?: KaiEpisodes[];
};
export type AnilistRepetitive = {
  data: AnilistData[];
  hasNextPage: boolean;
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
};
export type AnilistData = {
  malId: number;
  anilistId?: number;
  image: string;
  color: string;
  bannerImage: string;
  title: {
    romaji: string;
    english: string;
    native: string;
  };
  trailer: string;
  format: string;
  status: string;
  duration: number;
  score: number;
  genres: string;
  episodes: number;
  synopsis: string;
  season: string;
  startDate: string;
  endDate: string;
  studio: string;
  producers: string[];
};
