import { Stream } from "@/types";

const streams: Stream[] = [
  {
    uuid: "example-uuid",
    categories: [
      {
        uuid: "example-uuid",
        type: "horror",
        label: "Horror",
      },
    ],
    title: "Example Title",
    synopsis: "Example synopsis.",
    poster: "/assets/posters/example.jpg",
  },
];

export default streams;
