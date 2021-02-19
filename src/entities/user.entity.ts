import { Entity, Column, PrimaryGeneratedColumn, Generated } from "typeorm";
import { Role } from "../constants/constants";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "主键id",
  })
  id: number;

  @Column({
    comment: "uuid",
  })
  @Generated("uuid")
  uid: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 6,
    comment: "姓名",
  })
  name: string;

  @Column({
    type: "enum",
    nullable: false,
    enum: Role,
    default: Role.DEFAULT,
    comment: "身份",
  })
  role: number;

  @Column({
    type: "varchar",
    nullable: false,
    length: 64,
    comment: "密码",
  })
  password: string;

  @Column({
    type: "char",
    nullable: false,
    length: 11,
    unique: true,
    comment: "电话",
  })
  phone: string;

  @Column({
    type: "int",
    unsigned: true,
    nullable: false,
    default: 0,
    comment: "抽奖次数",
  })
  count: number;
}
