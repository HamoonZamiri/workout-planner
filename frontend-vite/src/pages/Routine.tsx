import { useRoutine } from "../hooks/api/useRoutine.ts";

const RoutinePage = () => {
    const queryResult = useRoutine();
    console.log(queryResult);
    return (
        <div className="flex justify-center">
            <h2 className="font-semibold text-2xl">Routines</h2>
            <div>

            </div>
        </div>
    )
};
export default RoutinePage;