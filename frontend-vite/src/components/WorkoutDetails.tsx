import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Workout } from "../utils/types";
import { api_base } from "../utils/constants";
import { FaHammer } from "react-icons/fa";
// import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import UpdateWorkoutDialog from "./UpdateWorkoutDialog";
import { BsTrash } from "react-icons/bs";
import useRoutinesContext from "../hooks/useRoutinesContext";

type WorkoutDetailsProps = {
	workout: Workout;
	routineId: string;
};

type DisplayRangeProps = {
	type: "Sets" | "Reps";
	low: number;
	high: number;
}

const DisplayRange = (props: DisplayRangeProps): JSX.Element => {
	if (props.low === props.high) {
		return <p>{props.type}: {props.low}</p>
	}
	return <p>{props.type}: {props.low} - {props.high}</p>
}

const WorkoutDetails = ({ routineId, workout }: WorkoutDetailsProps) => {
	const [open, setOpen] = useState(false);
	// const loadInc = 5; //value to increment load by with buttons
	// const repInc = 1; //value to increment reps by with buttons
	const { state } = useAuthContext();
	const { user } = state;

	const { dispatch } = useRoutinesContext();
	const handleClick = async () => {
		if (!user) {
			return;
		}
		const res = await fetch(api_base + "/api/workouts/" + workout.id, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
		await res.json();

		if (res.ok) {
			dispatch({
				type: "DELETE_WORKOUT",
				payload: { routineId, workout },
			});
		}
	};

	// const handleChange = async (updatedWorkout: Workout) => {
	// 	if (!user) {
	// 		return;
	// 	}
	// 	const res = await fetch(api_base + "/api/workouts/" + workout.id, {
	// 		method: "PUT",
	// 		body: JSON.stringify(updatedWorkout),
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 			Authorization: `Bearer ${user.token}`,
	// 		},
	// 	});
	// 	const json = await res.json();
	// 	console.log(json);
	// 	if (res.ok) {
	// 		const payload = { routineId, workout: updatedWorkout}
	// 		console.log(payload);
	// 		dispatch({
	// 			type: "UPDATE_WORKOUT",
	// 			payload: {routineId, workout: updatedWorkout}
	// 		});
	// 	}
	// };

	return (

		<div className="relative">
			<div
				className="grid grid-cols-1 justify-items-center bg-slate-100 border-solid
                border-[#a7dbd8] border-4 rounded-md p-2 sm:flex-shrink-0 sm:w-[350px] "
			>
				<h4 className="text-xl font-semibold flex justify-center">
					{workout.title}
				</h4>

				<div className="">
					<div className="">
						<p>Load: {workout.load} {workout.weightType}</p>
						{/* <div className="flex gap-1">
							<div
								className="cursor-pointer flex items-center"
								onClick={() =>
									handleChange({ ...workout, load: workout.load - loadInc })
								}
							>
								<AiFillMinusCircle />
							</div>
							<div
								className="cursor-pointer flex items-center"
								onClick={() =>
									handleChange({ ...workout, load: workout.load + loadInc })
								}
							>
								<AiFillPlusCircle />
							</div>
						</div> */}
					</div>

					<div className="flex gap-4">
						<DisplayRange type="Reps" low={workout.repsLow} high={workout.repsHigh} />
					</div>

					<div className="flex gap-4">
						<DisplayRange type="Sets" low={workout.setsLow} high={workout.setsHigh} />
						<div className="flex gap-1">
							{/* <div
								className="cursor-pointer flex items-center"
								onClick={() =>
									handleChange({ ...workout, sets: workout.sets - repInc })
								}
							>
								<AiFillMinusCircle />
							</div>

							<div
								className="cursor-pointer flex items-center"
								onClick={() =>
									handleChange({ ...workout, sets: workout.sets + repInc })
								}
							>
								<AiFillPlusCircle />
							</div> */}
						</div>

					</div>
				</div>
				<div className="flex justify-between justify-self-stretch">
					<FaHammer className="cursor-pointer" onClick={() => setOpen(true)} />
					<BsTrash className="cursor-pointer" onClick={handleClick} />
				</div>
			</div>
			<UpdateWorkoutDialog routineId={routineId} open={open} setOpen={setOpen} workout={workout} />
		</div>
	);
};
export default WorkoutDetails;
