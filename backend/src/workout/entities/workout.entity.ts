import { Column, Entity, ManyToOne } from "typeorm";
import { BaseModel } from "../../utils/base.entity";
import { Routine } from "../../routine/entities/routine.entity";

export type ExerciseWeightType = "lbs" | "kg";

@Entity()
export class Workout extends BaseModel {
  @Column({ nullable: false })
  title: string;

  @Column({ default: 4 })
  repsLow: number;

  @Column({ default: 12 })
  repsHigh: number;

  @Column({ nullable: false })
  load: number;

  @Column({
    type: "enum",
    enum: ["lbs", "kg"],
    default: "lbs",
  })
  weightType: ExerciseWeightType;

  @Column({ default: 1 })
  setsLow: number;

  @Column({ default: 3 })
  setsHigh: number;

  @Column({ nullable: false })
  userId: string;

  @ManyToOne(() => Routine, (routine) => routine.workouts, {
    onDelete: "CASCADE",
  })
  routine: Routine;
}

