import api from "@/services/api";
import { Stream } from "@/types";

const stream = {
  async streamsFromPage(page: number): Promise<Stream[] | false> {
    try {
      const res = await api.get(`/api/streams?page=${page}`);
      if (res.status === 401) return false;
      return res.data?.streams ?? [];
    } catch (err) {
      console.error(err);
      return [];
    }
  },
};

export default stream;
