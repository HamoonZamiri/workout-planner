import { Disclosure } from "@headlessui/react";
import { Routine } from "../utils/types";
import { BsArrow90DegDown } from "react-icons/bs";
import WorkoutDetails from "./WorkoutDetails";
import WorkoutFormDialog from "./WorkoutFormDialog";
import { useState } from "react";
import { handleNumericInputChange } from "../utils/forms";
import constants from "../utils/constants";
import { useAuthContext } from "../hooks/context/useAuthContext";
import useRoutinesContext from "../hooks/context/useRoutinesContext";
import DeleteRoutineDialog from "./DeleteRoutineDialog";

type RoutineDisclosureProps = {
  routine: Routine;
};

type Data = {
  timeToComplete: number;
  description: string;
};

const RoutineDisclosure = ({ routine }: RoutineDisclosureProps) => {
  const [isWorkoutDialogOpen, setIsWorkoutDialogOpen] = useState(false);
  const [isDeleteRoutineDialogOpen, setIsDeleteRoutineDialogOpen] =
    useState(false);
  const [error, setError] = useState("");
  const routineDispatch = useRoutinesContext().dispatch;
  const userContext = useAuthContext();

  const [data, setData] = useState<Data>({
    timeToComplete: routine.timeToComplete,
    description: routine.description,
  });

  const [editTTC, setEditTTC] = useState(false);
  const [editDescription, setEditDescription] = useState(false);

  const editTTCView = (): JSX.Element => {
    return !editTTC ? (
      <p
        onClick={() => setEditTTC(true)}
        className="font-bold text-xl sm:text-3xl"
      >
        {data.timeToComplete}
      </p>
    ) : (
      <input
        type="text"
        className="font-bold text-xl sm:text-3xl w-3/4"
        value={data.timeToComplete}
        onBlur={async () => handleBlur("timeToComplete", setEditTTC)}
        onChange={(e) =>
          handleNumericInputChange<Data>(e, setData, "timeToComplete")
        }
      />
    );
  };

  const handleBlur = async (
    key: keyof Data,
    setter: React.Dispatch<React.SetStateAction<boolean>>,
  ): Promise<void> => {
    const res = await fetch(
      `${constants.api_base}/api/core/routine/${routine.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userContext?.state.user?.accessToken}`,
        },
        body: JSON.stringify({ [key]: data[key] }),
      },
    );
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      return;
    }
    routineDispatch({ type: "UPDATE_ROUTINE", payload: json.data });
    setter(false);
  };

  return (
    <Disclosure
      as="div"
      className="w-[90%] sm:w-3/5 grid grid-cols-1 justify-items-start bg-blue-100 p-2 border-solid border-4 rounded-md mt-4"
    >
      <Disclosure.Button className="flex w-full justify-between mb-2">
        <div className="font-bold text-xl">{routine.title} Routine</div>
        <BsArrow90DegDown className="ui-open:rotate-90 ui-open:transform" />
      </Disclosure.Button>

      <Disclosure.Panel className="flex flex-col gap-4 w-full">
        <section className="w-full flex justify-center">
          {/* <h2 className="text-xl">Logistics</h2> */}
          <div className="w-1/2 border-solid border-gray-400 border p-5">
            <p className="text-gray-500">Time to Complete</p>
            <div className="flex items-baseline ">
              {editTTCView()}
              {/* <p className="font-bold text-3xl">{routine.timeToComplete}</p> */}
              <p className="text-gray-500 align-text-bottom">mins</p>
            </div>
          </div>

          <div className="w-1/2 border-solid border-gray-400 border p-5">
            <p className="text-gray-500">Number of Exercises</p>
            <p className="font-bold text-xl sm:text-3xl">
              {routine.workouts ? routine.workouts.length : 0}
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-semibold text-xl">Description</h2>
          {!editDescription ? (
            <p onClick={() => setEditDescription(true)}>
              {routine.description}
            </p>
          ) : (
            <textarea
              className="w-5/12"
              value={data.description}
              onChange={(e) =>
                setData((prev) => {
                  return {
                    ...prev,
                    description: e.target.value,
                  };
                })
              }
              onBlur={async () =>
                await handleBlur("description", setEditDescription)
              }
            />
          )}
        </section>

        <section>
          <h2 className="font-semibold text-xl">Exercises</h2>
          <button
            onClick={() => setIsWorkoutDialogOpen(true)}
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
        <button
          className="mt-6 font-semibold p-2 text-center rounded-md bg-red-200 hover:bg-red-300"
          onClick={() => setIsDeleteRoutineDialogOpen(true)}
        >
          Delete this Routine
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </Disclosure.Panel>
      <WorkoutFormDialog
        routineId={routine.id}
        open={isWorkoutDialogOpen}
        setOpen={setIsWorkoutDialogOpen}
      />
      <DeleteRoutineDialog
        routineId={routine.id}
        isOpen={isDeleteRoutineDialogOpen}
        setIsOpen={setIsDeleteRoutineDialogOpen}
      />
    </Disclosure>
  );
};

export default RoutineDisclosure;
