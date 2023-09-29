import { Routine, ServerResponse } from "../../utils/types";
import { useAuthContext } from "../useAuthContext";
import { api_base } from "../../utils/constants";
import { useEffect, useState } from "react";

export const useRoutine = () => {
	const context = useAuthContext();
	const user = context.state.user;
	const [data, setData] = useState<ServerResponse<Routine[]> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string| undefined>("");

	useEffect(() => {
		const getRoutines = async () => {
			if(!user) {
				setIsLoading(true);
				return;
			}
			const res = await fetch(`${api_base}/api/routines/${user.id}`, {
				headers: {
					Authorization: `Bearer ${user.token}`,
					"Content-Type": "application/json",
				},
			});

			const json: ServerResponse<Routine[]> = await res.json();
			if(!res.ok) {
				setError(json.error);
			}
			setData(json);
			setError("");
		};
		getRoutines();
	}, [user]);

	return { response: data, isLoading, error };
};