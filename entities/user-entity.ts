import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role-entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({
        length: 20
    })
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    salt!: string;

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({
        name: 'role'
    })
    role!: Role;

    @Column()
    access_token!: string;
}