import useRoutinesContext from "../hooks/context/useRoutinesContext.ts";
import { useMyRoutines } from "../hooks/api/useRoutine.ts";
import { useEffect, useState } from "react";
import RoutineDisclosure from "../components/RoutineDisclosure.tsx";
import CreateRoutineDialog from "../components/CreateRoutineDialog.tsx";
import { useAuthContext } from "../hooks/context/useAuthContext.ts";

const RoutinePage = () => {
  const [openCreateRoutine, setOpenCreateRoutine] = useState(false);
  const userContext = useAuthContext();
  const queryResult = useMyRoutines();
  const routineContext = useRoutinesContext();

  useEffect(() => {
    if (queryResult.queryData) {
      routineContext.dispatch({
        type: "SET_ROUTINES",
        payload: queryResult.queryData.data,
      });
    }
  }, [queryResult.queryData]);

  const routines = routineContext.state.routines;

  if (!routines) return <></>;

  return (
    <div className="grid grid-cols-1 justify-items-center mb-4">
      <h2 className="font-semibold text-2xl">Routines</h2>

      {routines.map((routine) => {
        return <RoutineDisclosure routine={routine} key={routine.id} />;
      })}

      <button
        className="font-semibold mt-6 p-2 text-center rounded-md bg-green-200 hover:bg-green-300"
        onClick={() => setOpenCreateRoutine(true)}
      >
        Create a Routine
      </button>

      <CreateRoutineDialog
        open={openCreateRoutine}
        setOpen={setOpenCreateRoutine}
        token={userContext.state.user?.accessToken ?? ""}
      />
    </div>
  );
};
export default RoutinePage;
