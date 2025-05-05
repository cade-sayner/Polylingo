import {Request} from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
        return false;
    }
};
