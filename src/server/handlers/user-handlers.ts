import express, { Express, Request } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { authenticate } from '../lib/authentication';

const userRepo = new UserRepository("users", "user_id")


export function registerUserRoutes(app: Express) {
    app.get("/users", getUser);
}

async function getUser(req:Request, res:any) {
    if(!(await authenticate(req))){
        return res.status(401).json({message:"Invalid jwt"});
    }

    let googleId  = req.query.googleId as string | undefined;
    if (!googleId) {
        return res.status(400).json({
            message: 'Missing required query parameter: googleId'
        });
    }
    const exists = await userRepo.Exists(googleId);
    if (!exists) {
        return res.status(404).json({
            message: 'User does not exist'
        });
    }
    return res.status(200).json(await userRepo.getByColumnName("googleId", String(googleId)));
}