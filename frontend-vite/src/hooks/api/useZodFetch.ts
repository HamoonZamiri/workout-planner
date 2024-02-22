import { z } from "zod";
import useRefresh from "./useRefresh";
import { useLogout } from "../auth/useLogout";

function useZodFetch() {
  const refresh = useRefresh();
  const { logout } = useLogout();

  const zodFetch = async <TData>(
    url: string,
    schema: z.Schema<TData>,
    options: RequestInit | undefined,
  ): Promise<TData> => {
    let res = await fetch(url, options);
    const json = await res.json();

    if (res.status === 401) {
      const accessToken = await refresh();
      if (accessToken !== null) {
        res = await fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            Authorization: `Bearer ${accessToken}`,
          },
        });
      } else {
        logout();
      }
    }
    if (!res.ok) throw new Error(json.error);

    const data = schema.parse(json);
    return data;
  };

  return zodFetch;
}

export default useZodFetch;
