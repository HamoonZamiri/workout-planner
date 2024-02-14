import {
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export class BaseDbEntity extends BaseEntity {
  constructor(id: string, createdAt: Date, updatedAt: Date) {
    super();
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
