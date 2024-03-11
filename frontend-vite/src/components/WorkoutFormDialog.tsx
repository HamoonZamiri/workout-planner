import { useState } from "react";
import { useAuthContext } from "../hooks/context/useAuthContext";
import constants from "../utils/constants";
import useRoutinesContext from "../hooks/context/useRoutinesContext";
import { WorkoutFormSchema, Workout } from "../schemas/Workout";
import { WorkoutFormData, APIResponse, initialFormData } from "../utils/types";
import { Dialog } from "@headlessui/react";
import { handleChange } from "../utils/forms";

type WorkoutFormProps = {
  routineId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const WorkoutFormDialog = ({ routineId, open, setOpen }: WorkoutFormProps) => {
  const { dispatch } = useRoutinesContext();
  const [form, setForm] = useState<WorkoutFormData>(initialFormData);
  const [error, setError] = useState("");
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const { state } = useAuthContext();
  const { user } = state;

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

    const res = await fetch(constants.api_base + "/api/core/workout", {
      method: "POST",
      body: JSON.stringify({ ...parsedBody.data, routineId }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const json: APIResponse<Workout> = await res.json();

    if (!res.ok) {
      setError(json.error ? json.error : "Something went wrong");
      setEmptyFields(json.emptyFields ? json.emptyFields : []);
      return;
    }

    setError("");
    setEmptyFields([]);
    setForm(initialFormData);
    const payload = { routineId, workout: json.data };
    dispatch({ type: "CREATE_WORKOUT", payload });
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
          className="grid grid-cols-1 gap-8 rounded-lg border bg-white p-3 w-[400px]"
          onSubmit={handleSubmit}
        >
          <h3 className="font-semibold text-2xl">Add a New Exercise</h3>

          <div>
            <label>Exercise Name:</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "title")}
              value={form.title}
              // className={emptyFields && emptyFields.includes("title") ? "error" : ""}
            />
            <p className="text-red-300">
              {emptyFields.includes("title") && "This field is required"}
            </p>
          </div>

          <div>
            <label>Load (lbs):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "load")}
              value={form.load}
              // className={emptyFields && emptyFields.includes("load") ? "error" : ""}
            />
            <p className="text-red-300">
              {emptyFields.includes("load") && "This field is required"}
            </p>
          </div>

          <div>
            <label># of Reps (min):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "repsLow")}
              value={form.repsLow}
              // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
            <p className="text-red-300">
              {emptyFields.includes("reps") && "This field is required"}
            </p>
          </div>

          <div>
            <label># of Reps (max):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "repsHigh")}
              value={form.repsHigh}
              // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
            <p className="text-red-300">
              {emptyFields.includes("reps") && "This field is required"}
            </p>
          </div>

          <div>
            <label># of Sets (min):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "setsLow")}
              value={form.setsLow}
              // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
            <p className="text-red-300">
              {emptyFields.includes("sets") && "This field is required"}
            </p>
          </div>

          <div>
            <label># of Sets (max):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) => handleChange(event, setForm, "setsHigh")}
              value={form.setsHigh}
              // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
            />
            <p className="text-red-300">
              {emptyFields.includes("sets") && "This field is required"}
            </p>
          </div>

          <button className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10">
            Add Workout
          </button>
          {error && <div className="text-red-300">{error}</div>}
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default WorkoutFormDialog;
