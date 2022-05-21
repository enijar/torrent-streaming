export type Errors = {
  [error: string]: string;
};

export type Messages = {
  [message: string]: string;
};

export type StreamCategory = {
  uuid: string;
  type: string;
  label: string;
};

export type Stream = {
  uuid: string;
  categories: StreamCategory[];
  title: string;
  synopsis: string;
  poster: string;
};
