import { DataSource } from "typeorm";
import { User } from "./entities/user-entity";
import { Role } from "./entities/role-entity";

const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 33006,
    username: "root",
    password: "my-secret-pw",
    database: "leovegas-db",
    synchronize: true,
    logging: true,
    entities: [User, Role], //Post, Category
    subscribers: [],
    migrations: []
});

export default AppDataSource;