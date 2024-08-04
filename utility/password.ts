import bcrypt from "bcrypt";
import { UserModel } from "../models";
import jwt, { JwtPayload } from "jsonwebtoken";

const APP_SECRET = "our_app_secret";

export const GetSalt = async () => {
    return await bcrypt.genSalt();
};

export const GetHashedPassword = async (password: string, salt: string) => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async (enteredPassword: string, savedPassword: string, salt: string) => {
    return (await GetHashedPassword(enteredPassword, salt)) === savedPassword;
}

export const getToken = (userModel: UserModel) => {
    const payload: JwtPayload = { id: userModel.id, roleId: userModel.role.id };
    return jwt.sign(payload, APP_SECRET,
        {
            expiresIn: '1h'
        });
}

export const validateToken = (token: string): (UserModel | false) => {
    try {
        if (token !== '') {
            const payload = jwt.verify(token.split(' ')[1], APP_SECRET) as UserModel;
            return payload as UserModel;
        }
        return false;
    }
    catch (error) {
        return false;
    }
}