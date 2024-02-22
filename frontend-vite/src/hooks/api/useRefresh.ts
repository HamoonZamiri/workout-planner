import { useCookies } from "react-cookie";
import { api_base } from "../../utils/constants";
import { APIResponse } from "../../utils/types";
import { useAuthContext } from "../context/useAuthContext";

type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

function useRefresh() {
  const { state, dispatch } = useAuthContext();

  const setCookie = useCookies(["user"])[1];
  const user = state.user;

  async function refresh(): Promise<string | null> {
    if (!user || !user.refreshToken) {
      return null;
    }
    const res = await fetch(api_base + "/api/auth/refresh/" + user.id, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ refreshToken: user.refreshToken }),
    });
    if (!res.ok) {
      return null;
    }
    const json = (await res.json()) as APIResponse<RefreshResponse>;
    setCookie(
      "user",
      {
        ...user,
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      },
      { path: "/" },
    );
    dispatch({ type: "REFRESH", payload: json.data });
    return json.data.accessToken;
  }

  return refresh;
}

export default useRefresh;
