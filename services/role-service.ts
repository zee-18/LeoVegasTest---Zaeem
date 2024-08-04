import AppDataSource from "../data-source";
import { Role } from "../entities/role-entity";
import { RoleEnum } from "../enums/role-enum";
import { RoleModel } from "../models";

export class RoleService {

    private roleRepo = AppDataSource.getRepository(Role);

    async findRole(roleId: number): Promise<RoleModel | false> {
        const role = await this.roleRepo.findOne({ where: { id: roleId } });
        if (!role) {
            return false;
        }
        return role as RoleModel;
    }

    async isAdmin(roleId: number): Promise<boolean> {
        const role = await this.roleRepo.findOne({ where: { id: roleId } });
        if (!role) {
            return false;
        }
        if (role.id === RoleEnum.Admin) {
            return true;
        }
        return false;
    }
}
