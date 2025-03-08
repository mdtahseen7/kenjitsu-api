export interface FastifyParams {
  season?: string;
  year?: string;
  animeId?: string;
  anilistId?: string;
  malId?: string;
  episodeId?: string;
  episodeNumber?: string;
}
export interface FastifyQuery {
  q?: string;
  page?: string;
  perPage?: string;
  format?: string;
  category?: string;
  server?: string;
  provider?: string;
}
