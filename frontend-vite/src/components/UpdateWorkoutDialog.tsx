import { useState } from "react";
import { Workout } from "../utils/types";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { api_base } from "../utils/constants";
import { Dialog } from "@headlessui/react";

type UpdateWorkoutDialogProps = {
	workout: Workout;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateWorkoutDialog = ({
	workout,
	open,
	setOpen,
}: UpdateWorkoutDialogProps) => {
	const [title, setTitle] = useState(workout.title);
	const [load, setLoad] = useState(workout.load + "");
	const [reps, setReps] = useState(workout.reps + "");
	const [error, setError] = useState("");
	const [emptyFields, setEmptyFields] = useState<string[]>([]);
	const { dispatch } = useWorkoutsContext();
	const { state } = useAuthContext();
	const { user } = state;

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!user) {
			setError("You must be logged in to add a workout");
			return;
		}
		const res = await fetch(api_base + "/api/workouts/" + workout._id, {
			method: "PATCH",
			body: JSON.stringify({ title, load, reps }),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.token}`,
			},
		});
		const json = await res.json();
		if (!res.ok) {
			setError(json.error);
			setEmptyFields(json.emptyFields);
		}
		if (res.ok) {
			setError("");
			setEmptyFields([]);
            const updatedWorkout: Workout = {_id: workout._id, title, load: Number(load), reps: Number(reps), user_id: workout.user_id}
			dispatch({
				type: "UPDATE_WORKOUT",
				payload: updatedWorkout,
			});
			setOpen(false);
		}
	};

	return (
		<Dialog
			className="absolute inset-0 h-screen flex justify-center items-center hover:cursor-pointer bg-gray-600 z-10 w-screen  bg-opacity-90 rounded-lg p-4"
			open={open}
			onClose={() => setOpen(false)}
		>
			<Dialog.Panel>
				<form
					className="rounded-lg border bg-white p-3 w-[400px] grid grid-cols-1 gap-8 hover:cursor-default"
					onSubmit={handleSubmit}
				>
					<Dialog.Title className="font-semibold text-xl">
						Edit Workout
					</Dialog.Title>
					<div>
						<label>Exercise Name:</label>
						<input
							className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
							type="text"
							onChange={(event) => setTitle(event.target.value)}
							value={title}
						/>
						<p className="text-red-300">
							{emptyFields.includes("title") && "This field is required"}
						</p>
					</div>
					<div>
						<label>Load (kg):</label>
						<input
							className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
							type="text"
							onChange={(event) => setLoad(event.target.value)}
							value={load}
						/>
						<p className="text-red-300">
							{emptyFields.includes("load") && "This field is required"}
						</p>
					</div>
					<div>
						<label># of Reps:</label>
						<input
							className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
							type="text"
							onChange={(event) => setReps(event.target.value)}
							value={reps}
						/>
						<p className="text-red-300">
							{emptyFields.includes("reps") && "This field is required"}
						</p>
					</div>
					<button
						className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10 p-2"
					>
						Update {workout.title}
					</button>
					{error && <div className="text-red-300">{error}</div>}
				</form>
			</Dialog.Panel>
		</Dialog>
	);
};
export default UpdateWorkoutDialog;