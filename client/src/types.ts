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
};
