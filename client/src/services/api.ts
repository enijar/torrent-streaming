import config from "@/config";
import { Request } from "@/types";

type Method = "get" | "post";

function request(endpoint: string, method: Method, data?: any): Request {
  const controller = new AbortController();
  return {
    abort() {
      controller.abort();
    },
    async send() {
      try {
        const res = await fetch(`${config.apiUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });
        const json = await res.json();
        return {
          data: json?.data ?? {},
          messages: json?.messages ?? {},
          errors: json?.errors ?? {},
          ok: res.ok,
          status: res.status,
        };
      } catch (err) {
        console.error(err);
        return {
          data: {},
          messages: {},
          errors: { server: "Server error" },
          ok: false,
          status: 500,
        };
      }
    },
  };
}

export default {
  get(endpoint: string): Request {
    return request(endpoint, "get");
  },
  post(endpoint: string, data: any): Request {
    return request(endpoint, "post", data);
  },
};
