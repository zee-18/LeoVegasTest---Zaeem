import Express from "express";
import { Request, Response } from "express";
import { LoginModel, UserModel } from "../models";
import validationMiddleware from "../middlewares/validation-middleware";
import { UserService } from "../services/user-service";
import { RoleService } from "../services/role-service";
import authenticationMiddleware from "../middlewares/authentication-middleware";
import { GetHashedPassword, GetSalt } from "../utility/password";

const router = Express.Router();
const userService = new UserService();
const roleService = new RoleService();

router.post('/login', validationMiddleware(LoginModel), async (req: Request, res: Response) => {
    try {
        const loginModel: LoginModel = req.body;
        const result = await userService.loginUser(loginModel);
        if (!result) {
            res.status(404).json({ message: 'Invalid Email or Password' });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/create-user', validationMiddleware(UserModel), async (req: Request, res: Response) => {
    try {
        const userModel: UserModel = req.body.userModel;
        userModel.salt = '';
        const role = await roleService.findRole(userModel.roleId);
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        const salt = await GetSalt();
        const hashedPassword = await GetHashedPassword(userModel.password, salt);
        userModel.salt = salt;
        userModel.password = hashedPassword;
        userModel.role = role;
        const result = await userService.createUser(userModel);
        res.status(200).json(result);

    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

router.get('/get-user/:id', authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const loggedInRoleId = Number(req.query.loggedInRoleId);
        const loggedInUserId = Number(req.query.loggedInUserId);
        const userId = Number(req.params?.id);
        const isAdmin = await roleService.isAdmin(loggedInRoleId);
        if (!isAdmin && loggedInUserId !== userId) {
            res.status(400).json('User can see his own details only!');
            return;
        }
        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

router.get('/get-all-users', authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const loggedInRoleId = Number(req.query.loggedInRoleId);
        const isAdmin = await roleService.isAdmin(loggedInRoleId);
        if (!isAdmin) {
            res.status(400).json('Only Admin can see all users details');
            return;
        }
        const result = await userService.getAllUsers();
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

router.post('/update-user', validationMiddleware(UserModel), authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const loggedInRoleId = Number(req.query.loggedInRoleId);
        const userModel: UserModel = req.body.userModel;
        const loggedInUserId = Number(req.query.loggedInUserId);
        const isAdmin = await roleService.isAdmin(loggedInRoleId);
        if (!isAdmin && loggedInUserId !== userModel.id) {
            res.status(400).json('User can only update its own details!');
            return;
        }
        const role = await roleService.findRole(userModel.roleId);
        if (!role) {
            res.status(404).json({ message: 'Role not found' });
            return;
        }
        userModel.role = role;
        const result = await userService.updateUser(userModel);
        if (!result) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

router.delete('/delete-user/:id', authenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const loggedInRoleId = Number(req.query.loggedInRoleId);
        const userId = Number(req.params?.id);
        const isAdmin = await roleService.isAdmin(loggedInRoleId);
        if (!isAdmin) {
            res.status(400).json('Only Admin can delete users');
            return;
        }
        const result = await userService.deleteUser(userId);
        if (!result) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully!' });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
});

export default router;