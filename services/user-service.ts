import AppDataSource from "../data-source";
import { User } from "../entities/user-entity";
import { LoginModel, UserModel } from "../models";
import { getToken, validatePassword } from "../utility/password";

export class UserService {

    private userRepo = AppDataSource.getRepository(User);

    async createUser(userModel: UserModel): Promise<UserModel> {

        const user = new User;
        user.name = userModel.name;
        user.email = userModel.email;
        user.password = userModel.password;
        user.access_token = "";
        user.role = userModel.role;
        user.salt = userModel.salt;
        return await this.userRepo.save(user) as UserModel;
    }

    async updateUser(userModel: UserModel): Promise<UserModel | false> {

        const user = await this.userRepo.findOne({ where: { id: userModel.id } });
        if (!user) {
            return false;
        }
        user.name = userModel.name;
        user.email = userModel.email;
        user.role = userModel.role;
        return await this.userRepo.save(user) as UserModel;
    }

    async getUserById(userId: number): Promise<UserModel | null> {

        const user = await this.userRepo.findOne({ where: { id: userId } });
        return user as UserModel;
    }

    async loginUser(login: LoginModel): Promise<string | boolean> {
        const user = await this.userRepo.findOne({ where: { email: login.email }, relations: { role: true} });
        if (!user) {
            return false;
        }
        const verifiedPassword = await validatePassword(login.password, user.password, user.salt);
        if (!verifiedPassword) {
            return false;
        }
        const token = getToken(user as UserModel);
        return token;
    }

    async getAllUsers(): Promise<UserModel[]> {
        const user = await this.userRepo.find();
        return user as UserModel[];
    }

    async deleteUser(userId: number): Promise<false | UserModel> {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) {
            return false;
        }
        return await this.userRepo.remove(user) as UserModel;
    }

}
