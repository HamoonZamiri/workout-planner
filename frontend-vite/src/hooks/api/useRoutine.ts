import { Routine, ServerResponse } from "../../utils/types";
import { useAuthContext } from "../useAuthContext";
import { api_base } from "../../utils/constants";
import { useQuery } from "react-query";

const getRoutines = async (userId: string, token: string) => {
	const res = await fetch(`${api_base}/api/routines/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	});
	const json: ServerResponse<Routine[]> = await res.json();
	if (!res.ok) {
		throw new Error(json.error);
	}
	return json;
}

export const useRoutine = () => {
	const context = useAuthContext();
	const user = context.state.user;

	// setting these vars to empty string so React query doesn't complain that they're undefined
	const id = user ? user.id : "";
	const token = user ? user.token : "";

	const { data, error, isError, isLoading } =
		useQuery<ServerResponse<Routine[]>>({
			queryKey: ["routines", id, token],
			queryFn: () => getRoutines(id, token),
			enabled: !!id && !!token,
		})

	return { queryData: data, error, isError, isLoading };

};