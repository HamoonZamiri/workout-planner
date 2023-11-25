export const handleNumericInputChange = <T>(
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<T>>,
    key: keyof T
  ) => {
    const value = parseInt(event.target.value);
    if (event.target.value === "" || isNaN(value)) {
      setState((prevState) => ({ ...prevState, [key]: 0 }))
      return;
    }
    setState((prevState) => ({ ...prevState, [key]: value }));
  };