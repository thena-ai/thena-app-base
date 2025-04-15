import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("examples")
export class ExampleEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @Column({ type: "boolean", default: false })
  processed: boolean;
}
