export type Workout = {
    id: string,
    title: string,
    reps: number,
    load: number,
    sets: number,
    userId: string
}

export type User = {
	email: string;
	token: string;
};