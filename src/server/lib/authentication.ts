import {Request} from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const authenticate = async (req: Request) => {
    const token = req.headers["authorization"]?.split(" ")[1] as string;
    if (!token) {
        return false;
    }
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
  
      const payload = ticket.getPayload();
  
      if (!payload) {
        return false;
      }
  
      req.user = {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };
      return true;

    } catch (err : any) {
        return false;
    }
};
