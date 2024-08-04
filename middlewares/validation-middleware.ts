import { plainToClass } from "class-transformer";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models";
import { validate, ValidationError } from "class-validator";

function validationMiddleware<T>(type: any): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        const userModel = plainToClass(type, req.body);
        validate(userModel).then((errors: ValidationError[]) => {
            if (errors.length > 0) {
                const message = errors.map((err: ValidationError) => Object.values(err.constraints || {}).join(', ')).join('; ');
                res.status(400).json({ message });
            }
            else {
                req.body.userModel = userModel;
                next();
            }
        });
    }
}

export default validationMiddleware;