import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity("facts")
export class Facts {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 22 })
    setby!: string;

    @Column({ type: "text" })
    fact!: string;

    @Column({ type: "text" })
    value!: string;
}