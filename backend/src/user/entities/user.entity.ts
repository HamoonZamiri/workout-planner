import { Column, Entity, Index } from "typeorm";
import { BaseModel } from "../../utils/base.entity";

@Entity()
export class User extends BaseModel {

    @Index("email")
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;
}