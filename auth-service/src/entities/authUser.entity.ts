import { Column, Index } from "typeorm";
import { BaseDbEntity } from "./base.entity";
import { randomUUID } from "crypto";

export class AuthUser extends BaseDbEntity {
  constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    email: string,
    password: string,
  ) {
    super(id, createdAt, updatedAt);
    this.email = email;
    this.password = password;
    this.refreshToken = randomUUID();
  }

  @Index("email")
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  refreshToken: string;
}
