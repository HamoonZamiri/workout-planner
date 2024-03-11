import { useEffect, useState } from "react";
import { WorkoutFormData } from "../utils/types";
import { WorkoutFormSchema, Workout } from "../schemas/Workout";
import { useAuthContext } from "../hooks/context/useAuthContext";
import constants from "../utils/constants";
import { Dialog } from "@headlessui/react";
import useRoutinesContext from "../hooks/context/useRoutinesContext";
import { handleChange } from "../utils/forms";

type UpdateWorkoutDialogProps = {
  routineId: string;
  workout: Workout;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const initialFormData = (workout: Workout): WorkoutFormData => {
  return {
    title: workout.title,
    load: workout.load.toString(),
    repsHigh: workout.repsHigh.toString(),
    repsLow: workout.repsLow.toString(),
    setsHigh: workout.setsHigh.toString(),
    setsLow: workout.setsLow.toString(),
  };
};

const UpdateWorkoutDialog = ({
  workout,
  open,
  setOpen,
  routineId,
}: UpdateWorkoutDialogProps) => {
  const [form, setForm] = useState<WorkoutFormData>(initialFormData(workout));
  const [error, setError] = useState("");
  const { dispatch } = useRoutinesContext();
  const { state } = useAuthContext();
  const { user } = state;

  useEffect(() => {
    setForm((prev) => ({ ...prev, title: workout.title }));
    setForm((prev) => ({ ...prev, load: workout.load.toString() }));
    setForm((prev) => ({ ...prev, repsHigh: workout.repsHigh.toString() }));
    setForm((prev) => ({ ...prev, repsLow: workout.repsLow.toString() }));
    setForm((prev) => ({ ...prev, setsHigh: workout.setsHigh.toString() }));
    setForm((prev) => ({ ...prev, setsLow: workout.setsLow.toString() }));
  }, [workout, error]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setError("You must be logged in to add a workout");
      return;
    }
    const parsedBody = WorkoutFormSchema.safeParse(form);
    if (!parsedBody.success) {
      setError(parsedBody.error.issues[0].message);
      return;
    }

    const res = await fetch(
      constants.api_base + "/api/core/workout/" + workout.id,
      {
        method: "PUT",
        body: JSON.stringify(parsedBody.data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      return;
    }
    setError("");
    const updatedWorkout: Workout = json.data;
    const payload = { routineId, workout: updatedWorkout };
    dispatch({
      type: "UPDATE_WORKOUT",
      payload,
    });
    setOpen(false);
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
              onChange={(event) => handleChange(event, setForm, "title")}
              value={form.title}
            />
          </div>

          <div>
            <label>Load (kg):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "load")}
              value={form.load}
            />
          </div>

          <div className="flex justify-between">
            <div>
              <label># of Reps (min):</label>
              <input
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                type="text"
                onChange={(event) => handleChange(event, setForm, "repsLow")}
                value={form.repsLow}
              />
            </div>

            <div>
              <label># of Reps (max):</label>
              <input
                className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
                type="text"
                onChange={(event) => handleChange(event, setForm, "repsHigh")}
                value={form.repsHigh}
              />
            </div>
          </div>

          <div>
            <label># of Sets (min):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "setsLow")}
              value={form.setsLow}
            />
          </div>

          <div>
            <label># of Sets:</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                            placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "setsHigh")}
              value={form.setsHigh}
            />
          </div>

          <button className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10 p-2">
            Update {workout.title}
          </button>

          {error && <div className="text-red-300">{error}</div>}
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};
export default UpdateWorkoutDialog;
