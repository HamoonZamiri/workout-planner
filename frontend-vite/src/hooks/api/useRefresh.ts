import { useCookies } from "react-cookie";
import constants from "../../utils/constants";
import { createServerResponseSchema } from "../../schemas/ServerResponse";
import { useAuthContext } from "../context/useAuthContext";
import { z } from "zod";

const RefreshSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const RefreshResponseSchema = createServerResponseSchema(RefreshSchema);

function useRefresh() {
  const { state, dispatch } = useAuthContext();

  const setCookie = useCookies(["user"])[1];
  const user = state.user;

  async function refresh(): Promise<string | null> {
    if (!user || !user.refreshToken) {
      return null;
    }
    const res = await fetch(
      constants.api_base + "/api/auth/refresh/" + user.id,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ refreshToken: user.refreshToken }),
      },
    );
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    const parsedJson = RefreshResponseSchema.parse(json);
    setCookie(
      "user",
      {
        ...user,
        accessToken: parsedJson.data.accessToken,
        refreshToken: parsedJson.data.refreshToken,
      },
      { path: "/" },
    );
    dispatch({ type: "REFRESH", payload: parsedJson.data });
    return json.data.accessToken;
  }

  return refresh;
}

export default useRefresh;
