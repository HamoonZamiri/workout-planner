import { useState } from "react";
import { useAuthContext } from "../hooks/context/useAuthContext";
import constants from "../utils/constants";
import useRoutinesContext from "../hooks/context/useRoutinesContext";
import { APIResponse } from "../utils/types";
import { Workout } from "../schemas/Workout";

type WorkoutFormProps = {
  routineId: string;
};

const WorkoutForm = ({ routineId }: WorkoutFormProps) => {
  const { dispatch } = useRoutinesContext();
  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
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
    const workout = { title, load, reps };

    const res = await fetch(constants.api_base + "/api/core/workout", {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
    const json: APIResponse<Workout> = await res.json();

    if (!res.ok) {
      setError(json.error ? json.error : "Something went wrong");
      setEmptyFields(json.emptyFields ? json.emptyFields : []);
    }
    if (res.ok) {
      setError("");
      setEmptyFields([]);
      setTitle("");
      setLoad("");
      setReps("");
      const payload = { routineId, workout: json.data };
      dispatch({ type: "CREATE_WORKOUT", payload });
    }
  };
  return (
    <form className="grid grid-cols-1 gap-8" onSubmit={handleSubmit}>
      <h3 className="font-semibold text-2xl">Add a New Exercise</h3>
      <div>
        <label>Exercise Name:</label>
        <input
          className="block w-full rounded-md border-0 px-1.5 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-200 sm:text-sm sm:leading-6"
          type="text"
          onChange={(event) => setTitle(event.target.value)}
          value={title}
          // className={emptyFields && emptyFields.includes("title") ? "error" : ""}
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
          // className={emptyFields && emptyFields.includes("load") ? "error" : ""}
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
          // className={ emptyFields && emptyFields.includes("reps") ? "error" : "" }
        />
        <p className="text-red-300">
          {emptyFields.includes("reps") && "This field is required"}
        </p>
      </div>
      <button className="w-full bg-blue-100 hover:bg-blue-200 rounded-lg h-10">
        Add Workout
      </button>
      {error && <div className="text-red-300">{error}</div>}
    </form>
  );
};

export default WorkoutForm;
