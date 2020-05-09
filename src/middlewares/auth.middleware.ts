import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from "../models/users.model";

async function auth(req: Request|any, res: Response, next: NextFunction) {
    try {
        const token: any = req.headers.authorization?.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
        const user = await User.findById(decoded._id);

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        res.status(500).send();
    }
}

export default auth;