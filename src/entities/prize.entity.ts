import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity("prizes")
export class PrizeEntity {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "主键id",
  })
  id: number;

  @Column({
    type: "varchar",
    nullable: false,
    length: 64,
    comment: "名称",
  })
  name: string;

  @Column({
    type: "int",
    nullable: false,
    comment: "概率",
  })
  probability: number;
}
