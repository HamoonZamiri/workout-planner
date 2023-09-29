import { useQuery } from "react-query";
import { Routine, ServerResponse } from "../../utils/types";
import { useAuthContext } from "../useAuthContext";
import { api_base } from "../../utils/constants";

export const useRoutine = () => {
	const { state } = useAuthContext();
	const user = state.user;

	const getRoutines = async () => {
		const res = await fetch(`${api_base}/api/routines/${user?.id}`, {
			headers: {
				Authorization: `Bearer ${user?.token}`,
				"Content-Type": "application/json",
			},
		});

		const json: ServerResponse<Routine[]> = await res.json();
		return json;
	};

	const { data, isLoading, isError } = useQuery<ServerResponse<Routine[]>>(
		"routines",
		getRoutines
	);
	return { data, isLoading, isError };
};