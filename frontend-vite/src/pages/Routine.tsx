import useRoutinesContext from "../hooks/useRoutinesContext.ts";
import { useRoutine } from "../hooks/api/useRoutine.ts";
import { useEffect } from "react";
import RoutineDisclosure from "../components/RoutineDisclosure.tsx";

const RoutinePage = () => {
    const queryResult = useRoutine();
    const routineContext = useRoutinesContext();
    useEffect(() => {
        if (queryResult.queryData) {
            routineContext.dispatch({
                type: "SET_ROUTINES",
                payload: queryResult.queryData.data,
            });
        }
    }, [queryResult.queryData])
    const routines = routineContext.state.routines;
    if (!routines) return <></>
    return (
        <div className="grid grid-cols-1 justify-items-center">
            <h2 className="font-semibold text-2xl">Routines</h2>
            {routines.map(routine => {
                return <RoutineDisclosure routine={routine} key={routine.id} />
            })}
        </div>
    );
};
export default RoutinePage;