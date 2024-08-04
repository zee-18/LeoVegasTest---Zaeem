import { isEmail, IsEmail, IsNotEmpty } from "class-validator";

export class UserModel {

    id!: number;
    
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    password!: string;

    role!: RoleModel;

    roleId!: number;

    access_token!: string;

    salt!: string;
}

export class LoginModel {
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsNotEmpty()
    password!: string;
}

export class RoleModel {
    id!: number;
    role_name!: string;
    users!: UserModel[];
}

