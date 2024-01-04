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

export const handleChange = <TForm>(
	event: React.ChangeEvent<HTMLInputElement>,
	setForm: React.Dispatch<React.SetStateAction<TForm>>,
	formKey: keyof TForm
): void => {
	setForm((prev) => ({
		...prev,
		[formKey]: event.target.value,
	}));
};
