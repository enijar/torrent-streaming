import config from "@/config";
import { Errors, Messages } from "@/types";

type Response = {
  data: any;
  messages: Messages;
  errors: Errors;
  ok: boolean;
};

type Method = "get" | "post";

async function request(
  endpoint: string,
  method: Method,
  data?: any
): Promise<Response> {
  try {
    const res = await fetch(`${config.apiUrl}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: data ? JSON.stringify(data) : undefined,
    });
    const json = await res.json();
    return {
      data: json?.data ?? {},
      messages: json?.messages ?? {},
      errors: json?.errors ?? {},
      ok: res.ok,
    };
  } catch (err) {
    console.error(err);
    return {
      data: {},
      messages: {},
      errors: { server: "Server error" },
      ok: false,
    };
  }
}

export default {
  get(endpoint: string): Promise<Response> {
    return request(endpoint, "get");
  },
  post(endpoint: string, data: any): Promise<Response> {
    return request(endpoint, "post", data);
  },
};
