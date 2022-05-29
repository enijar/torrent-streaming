export type Errors = {
  [error: string]: string;
};

export type Messages = {
  [message: string]: string;
};

export type Stream = {
  uuid: string;
  genres: string[];
  title: string;
  synopsis: string;
  largeCoverImage: string;
  youTubeTrailerCode: string;
  imdbCode: string;
  rating: number;
  year: number;
};

export type Response = {
  data: any;
  messages: Messages;
  errors: Errors;
  ok: boolean;
  status: number;
};

export type Request = { abort: () => void; send: () => Promise<Response> };
