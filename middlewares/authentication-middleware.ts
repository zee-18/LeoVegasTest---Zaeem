import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models";
import { validate, ValidationError } from "class-validator";
import { validateToken } from "../utility/password";

function authenticationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({ message: 'Token is missing' });
        return;
    }
    const payload = validateToken(token);
    if (!payload) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }
    req.query.loggedInRoleId = payload.roleId.toString();
    req.query.loggedInUserId = payload.id.toString();
    next();

}

export default authenticationMiddleware;