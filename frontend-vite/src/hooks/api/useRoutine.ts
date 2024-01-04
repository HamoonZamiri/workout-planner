import {
	RoutineSchema,
	createServerResponseSchema,
	zodFetch,
} from "../../utils/types";
import { useAuthContext } from "../useAuthContext";
import { api_base } from "../../utils/constants";
import { useQuery } from "react-query";
import { z } from "zod";

export const useAllRoutines = () => {
	const context = useAuthContext();
	const user = context.state.user;

	// setting these vars to empty string so React query doesn't complain that they're undefined
	const token = user ? user.token : "";

	const ServerResponseSchema = createServerResponseSchema(
		z.array(RoutineSchema)
	);

	const { data, error, isError, isLoading } = useQuery<
		z.infer<typeof ServerResponseSchema>
	>({
		queryKey: ["routines", token],
		queryFn: () =>
			zodFetch(`${api_base}/api/routines/`, ServerResponseSchema, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		enabled: !!token,
	});

	return { queryData: data, error, isError, isLoading };
};

export const useMyRoutines = () => {
	const context = useAuthContext();
	const user = context.state.user;

	// setting these vars to empty string so React query doesn't complain that they're undefined
	const token = user ? user.token : "";

	const ServerResponseSchema = createServerResponseSchema(
		z.array(RoutineSchema)
	);

	const { data, error, isError, isLoading } = useQuery<
		z.infer<typeof ServerResponseSchema>
	>({
		queryKey: ["routines", token],
		queryFn: () =>
			zodFetch(`${api_base}/api/routines/mine`, ServerResponseSchema, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		enabled: !!token,
	});

	return { queryData: data, error, isError, isLoading };
};
