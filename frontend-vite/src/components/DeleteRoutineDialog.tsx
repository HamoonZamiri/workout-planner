import { Dialog } from "@headlessui/react";
import { useAuthContext } from "../hooks/context/useAuthContext";
import constants from "../utils/constants";
import useRoutinesContext from "../hooks/context/useRoutinesContext";
import { useState } from "react";

type DeleteRoutineDialogProps = {
  routineId: string;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DeleteRoutineDialog = ({
  routineId,
  isOpen,
  setIsOpen,
}: DeleteRoutineDialogProps) => {
  const userContext = useAuthContext();
  const token = userContext.state.user?.accessToken ?? "";
  const [error, setError] = useState("");

  const routineDispatch = useRoutinesContext().dispatch;
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch(
      `${constants.api_base}/api/core/routine/${routineId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const json = await res.json();
    if (!res.ok) {
      setError(json.error);
      return;
    }
    setError("");
    routineDispatch({ type: "DELETE_ROUTINE", payload: { routineId } });
    setIsOpen(false);
  };

  return (
    <Dialog
      className="relative inset-0 h-screen flex justify-center items-center hover:cursor-pointer bg-gray-600 z-10 w-screen  bg-opacity-90 rounded-lg p-4"
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <Dialog.Panel className="text-center">
        <div className="rounded-lg border bg-white p-3 w-[400px] grid grid-cols-1 gap-4 hover:cursor-default">
          <Dialog.Title className="font-semibold text-center text-xl">
            Delete Routine
          </Dialog.Title>
          <Dialog.Description>
            This will permanently delete this routine.
          </Dialog.Description>

          <p>
            Are you sure you want to delete this routine? All of your data will
            be permanently removed. This action cannot be undone.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              className="font-semibold p-2 text-center rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="font-semibold p-2 text-center text-red-400 rounded-md bg-gray-200 hover:bg-gray-300"
              onClick={handleDelete}
            >
              Yes, Delete Routine
            </button>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default DeleteRoutineDialog;
