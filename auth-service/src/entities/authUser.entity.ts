import { Column, Entity, Index } from "typeorm";
import { BaseDbEntity } from "./base.entity";
import { randomUUID } from "crypto";

@Entity("auth_user")
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

    // set default expiry of refresh token to 3 days ahead
    this.refreshTokenExpiration = new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000,
    );
  }

  @Index("email")
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  refreshToken: string;

  @Column({ nullable: false })
  refreshTokenExpiration: Date;
}
