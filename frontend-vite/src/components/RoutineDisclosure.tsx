import { Disclosure } from "@headlessui/react";
import { Routine } from "../utils/types";
import { BsArrowsExpand } from "react-icons/bs";
import WorkoutDetails from "./WorkoutDetails";
import WorkoutFormDialog from "./WorkoutFormDialog";
import { useState } from "react";

type RoutineDisclosureProps = {
	routine: Routine;
};
const RoutineDisclosure = ({ routine }: RoutineDisclosureProps) => {
	const [open, setOpen] = useState(false);
	return (
		<Disclosure
			as="div"
			className="w-[90%] sm:w-3/5 grid grid-cols-1 justify-items-start bg-blue-100 p-2 border-solid border-4 rounded-md mt-4"
		>
			<Disclosure.Button className="flex w-full justify-between mb-2">
				<div className="font-bold text-xl">{routine.title} Routine</div>
				<BsArrowsExpand className="" />
			</Disclosure.Button>

			<Disclosure.Panel className="flex flex-col gap-4 w-full">
				<section className="w-full flex justify-center">
					{/* <h2 className="text-xl">Logistics</h2> */}
					<div className="w-1/2 border-solid border-gray-400 border p-5">
						<p className="text-gray-500">Time to Complete</p>
						<div className="flex items-baseline ">
							<p className="font-bold text-3xl">{routine.timeToComplete}</p>
							<p className="text-gray-500 align-text-bottom">mins</p>
						</div>
					</div>

					<div className="w-1/2 border-solid border-gray-400 border p-5">
						<p className="text-gray-500">Number of Exercises</p>
						<p className="font-bold text-3xl">{routine.workouts.length}</p>
					</div>
				</section>

				<section>
					<h2 className="font-semibold text-xl">Description</h2>
					<p>{routine.description}</p>
				</section>

				<section>
					<h2 className="font-semibold text-xl">Exercises</h2>
					<button
						onClick={() => setOpen(true)}
						className="h-8 p-1 bg-[#a7dbd8] mb-3 hover:bg-[#96c5c2] font-semibold rounded w-52"
					>
						Add Exercise
					</button>

					<div className="flex flex-col overflow-x-scroll sm:flex-row sm:flex-shrink-0 max-w-screen gap-2 mb-4">
						{routine.workouts &&
							routine.workouts.map((workout) => {
								return (
									<WorkoutDetails
										routineId={routine.id}
										key={workout.id}
										workout={workout}
									/>
								);
							})}
					</div>
				</section>
			</Disclosure.Panel>
			<WorkoutFormDialog routineId={routine.id} open={open} setOpen={setOpen} />
		</Disclosure>
	);
};

export default RoutineDisclosure;
