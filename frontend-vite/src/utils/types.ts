export type Workout = {
    id: string,
    title: string,
    reps: number,
    load: number,
    sets: number,
    userId: string
}

export type User = {
    id: string,
	email: string;
	token: string;
};

export type Routine = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    description: string;
    userId: string;
    workouts: Workout[];
}

export type ServerResponse<T> = {
    message: string;
    data: T
    error?: string;
}