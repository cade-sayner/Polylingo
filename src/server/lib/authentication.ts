import {Request} from 'express';
import { OAuth2Client } from 'google-auth-library';
import { UserRepository } from '../repositories/user-repository';
import { RoleRepository } from '../repositories/role-repository';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userRepo = new UserRepository("users", "user_id");
const roleRepo = new RoleRepository("roles", "id");

export const authenticate = async (req: Request, res:any, next:any) => {
  const token = req.headers["authorization"]?.split(" ")[1] as string;
  if (!token) {
      return res.status(401).json({message : "No token provided"});
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({message : "Unable to obtain ticket payload "});
    }

    req.user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };
    // at this point carry on to the next middleware function
    next();

  } catch (err : any) {
      res.status(401).json({message:"Unable to verify jwt"});
  }
};

export const authorize = (allowedRoles: string[]) => {
  return async (req: Request, res: any, next: any) => {
    try {
      let user = await userRepo.getByColumnName("googleId", getGoogleId(req));
      if (user == null) {
        return res.status(404).json({ message: "Logged in user could not be found" });
      }
      let roleId = user.roleId as number;
      let role = await roleRepo.getByID(roleId);
      if (role == null) {
          return res.status(404).json({ message: "Role for user could not be found" });
      }

      if (!allowedRoles.includes(role.role)) {
        return res.status(403).json({ message: 'You do not have permission to perform this action.' });
      }

      next();
    } catch (err) {
      console.error('Authorization error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
};

export const getGoogleId = (req: Request) => {
    return (req?.user as { googleId: string })?.googleId;
}