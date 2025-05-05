import express, { Express, Request } from 'express';
import { UserRepository } from '../repositories/user-repository';
import { RoleRepository } from '../repositories/role-repository'
import { authenticate } from '../lib/authentication';

const userRepo = new UserRepository("users", "user_id")
const roleRepo = new RoleRepository("roles", "id");

export function registerUserRoutes(app: Express) {
    app.get("/api/users", authenticate, getUser);
    app.get("/api/users/role", authenticate, getUserRole);
}

async function getUserRole(req: Request, res: any) {
    try {
        let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
        if (user == null) {
            return res.status(500).json({ message: "Logged in user could not be found" });
        }
        let roleId = user.roleId as number;
        let role = await roleRepo.getByID(roleId);
        if (role == null) {
            return res.status(404).json({ message: "Role for user could not be found" });
        }
        return res.status(200).json(role);
    } catch (e) {
        return res.status(500).json({ message: "An error occured while trying to fetch roles."});
        // TODO: Log the exception here
    }
}

async function getUser(req: Request, res: any) {
    try{
    let googleId = req.query.googleId as string | undefined;
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
    }catch(e){
        return res.status(500).json({message: "An error occured while trying to fetch user."});
        // TODO : log the error here
    }
}

function getGoogleId(req: Request) {
    return (req?.user as { googleId: string })?.googleId;
}