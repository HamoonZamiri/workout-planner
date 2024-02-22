import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { api_base } from "../utils/constants";
import useRoutinesContext from "../hooks/context/useRoutinesContext";

type CreateRoutineDialogProps = {
  token: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

type RoutineForm = {
  title: string;
  description: string;
  timeToComplete: number;
};

const CreateRoutineDialog = ({
  token,
  open,
  setOpen,
}: CreateRoutineDialogProps) => {
  const [routineForm, setRoutineForm] = useState<RoutineForm>({
    title: "",
    description: "",
    timeToComplete: 0,
  });
  const routineContext = useRoutinesContext();
  const [error, setError] = useState("");

  const handleTTCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (event.target.value === "" || isNaN(value)) {
      setRoutineForm({ ...routineForm, timeToComplete: 0 });
      return;
    }
    setRoutineForm({ ...routineForm, timeToComplete: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await fetch(api_base + "/api/core/routine", {
      method: "POST",
      body: JSON.stringify(routineForm),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error);
      return;
    }
    setError("");
    setRoutineForm({ title: "", description: "", timeToComplete: 0 });
    routineContext.dispatch({ type: "CREATE_ROUTINE", payload: json.data });
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
          onSubmit={handleSubmit}
          className="rounded-lg border bg-white p-3 w-[400px] grid grid-cols-1 gap-8 hover:cursor-default"
        >
          <Dialog.Title className="font-semibold text-xl">
            Create a Routine
          </Dialog.Title>

          <div>
            <label>Title:</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              onChange={(event) =>
                setRoutineForm({
                  ...routineForm,
                  title: event.target.value,
                })
              }
              value={routineForm.title}
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              onChange={(event) =>
                setRoutineForm({
                  ...routineForm,
                  description: event.target.value,
                })
              }
              value={routineForm.description}
            />
          </div>

          <div>
            <label>Time to Complete (minutes):</label>
            <input
              className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
              type="text"
              inputMode="numeric"
              onChange={handleTTCChange}
              value={routineForm.timeToComplete}
            />
          </div>
          <button className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10">
            Add Routine
          </button>
          {error && <div className="text-red-300">{error}</div>}
        </form>
      </Dialog.Panel>
    </Dialog>
  );
};

export default CreateRoutineDialog;
