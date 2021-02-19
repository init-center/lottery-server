import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
@Entity("records")
export class RecordEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "主键id",
  })
  id: number;

  @Column({
    type: "int",
    nullable: false,
    comment: "奖品id",
  })
  prize_id: number;

  @Column({
    type: "varchar",
    nullable: false,
    length: 64,
    comment: "奖品名称",
  })
  prize_name: string;

  @Column({
    type: "int",
    nullable: false,
    comment: "用户id",
  })
  user_id: number;

  @Column({
    type: "char",
    nullable: false,
    length: 11,
    comment: "用户电话",
  })
  user_phone: string;

  @Column({
    type: "varchar",
    nullable: false,
    length: 6,
    comment: "用户姓名",
  })
  user_name: string;

  @CreateDateColumn({
    comment: "创建时间",
  })
  created_at: Date;
}
