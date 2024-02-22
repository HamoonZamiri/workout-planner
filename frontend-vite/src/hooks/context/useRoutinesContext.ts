import { useContext } from "react";
import { RoutinesContext } from "../../context/RoutinesContext";

const useRoutinesContext = () => {
  const context = useContext(RoutinesContext);
  if (!context) {
    throw new Error(
      "useRoutinesContext must be used within a RoutinesProvider",
    );
  }
  return context;
};

export default useRoutinesContext;

