import { Column, Entity, OneToMany } from "typeorm";
import { BaseModel } from "../../utils/base.entity";
import { Workout } from "../../workout/entities/workout.entity";

@Entity("routine")
export class Routine extends BaseModel {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @OneToMany(() => Workout, (workout) => workout.routine, {
    onDelete: "CASCADE",
    nullable: true,
  })
  workouts: Workout[];

  @Column({ default: 0 })
  timeToComplete: number;

  @Column({ nullable: false })
  userId: string;
}

