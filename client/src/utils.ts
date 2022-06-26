import { CDN_URL } from "@/consts";

export function asset(src: string) {
  const url = new URL(src);
  return src.replace(`${url.protocol}//${url.host}`, CDN_URL);
}

export function formatTime(time: number) {
  const hours = Math.floor(time / 3600);
  time %= 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return { hours, minutes, seconds };
}

export function formatVideoTime(time: number): string {
  const hours = Math.floor(time / 3600);
  time %= 3600;
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const unit = (value: number): string => {
    return String(value).padStart(2, "0");
  };
  return `${unit(hours)}:${unit(minutes)}:${unit(seconds)}`;
}
