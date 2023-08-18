export type Workout = {
    _id: string,
    title: string,
    reps: number,
    load: number,
    user_id: string
}

export type User = {
	email: string;
	token: string;
};