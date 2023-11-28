import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "../../utils/base.entity";
import { Routine } from "../../routine/entities/routine.entity";

@Entity()
export class Workout extends BaseModel {
    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    reps: number;

    @Column({ nullable: false })
    load: number;

    @Column({ nullable: false })
    sets: number;

    @Column({ nullable: false })
    userId: string;

    @ManyToOne(
        () => Routine, (routine) => routine.workouts,
        { onDelete: "CASCADE" }
    )
    routine: Routine;
}