import { RoutineSchema, createServerResponseSchema } from "../../utils/types";
import useZodFetch from "./useZodFetch";
import { useAuthContext } from "../context/useAuthContext";
import constants from "../../utils/constants";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllRoutines = () => {
  const context = useAuthContext();
  const user = context.state.user;
  const zodFetch = useZodFetch();

  // setting these vars to empty string so React query doesn't complain that they're undefined
  const token = user ? user.accessToken : "";

  const ServerResponseSchema = createServerResponseSchema(
    z.array(RoutineSchema),
  );

  const { data, error, isError, isLoading } = useQuery<
    z.infer<typeof ServerResponseSchema>
  >({
    queryKey: ["routines", token],
    queryFn: () =>
      zodFetch(
        `${constants.api_base}/api/core/routine/`,
        ServerResponseSchema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    enabled: !!token,
  });

  return { queryData: data, error, isError, isLoading };
};

export const useMyRoutines = () => {
  const context = useAuthContext();
  const user = context.state.user;
  const zodFetch = useZodFetch();

  // setting these vars to empty string so React query doesn't complain that they're undefined
  const token = user ? user.accessToken : "";

  const ServerResponseSchema = createServerResponseSchema(
    z.array(RoutineSchema),
  );

  const { data, error, isError, isLoading } = useQuery<
    z.infer<typeof ServerResponseSchema>
  >({
    queryKey: ["routines", token],
    queryFn: () =>
      zodFetch(
        `${constants.api_base}/api/core/routine/mine`,
        ServerResponseSchema,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    enabled: !!token,
  });

  return { queryData: data, error, isError, isLoading };
};
