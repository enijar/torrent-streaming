import api from "@/services/api";
import { Stream } from "@/types";

const stream = {
  async streams(page: number, q: string): Promise<Stream[] | false> {
    try {
      const endpoint = `/api/streams?page=${page}&q=${q}`;
      const res = await api.get(endpoint);
      if (res.status === 401) return false;
      return res.data?.streams ?? [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
};

export default stream;
