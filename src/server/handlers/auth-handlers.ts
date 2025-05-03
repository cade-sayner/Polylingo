import { Express} from 'express';
import { UserRepository } from '../repositories/user-repository';

const userRepo = new UserRepository("users", "user_id")

export function registerAuthRoutes(app: Express) {
    app.get("/auth/login", login);
}

async function login(req:any, res:any) {
    let code= req.query.code as string | undefined;
    if (!code) {
        return res.status(400).json({
            message: 'Missing required query parameter: code'
        });
    }

    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.REDIRECT_URI as string,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    });

    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body.toString(),
      });
    
    if(!response.ok){
        return res.status(500).json({message : "Something went wrong trying to log you in"});
    }

    // TODO: make a type for the google response and assert the type it here
    const data = await response.json();
    return res.status(200).json({
        jwt: data.id_token
    })

    // create a user here if one does not yet exist

    // const exists = await userRepo.Exists(googleId);
    // if (!exists) {
    //     return res.status(404).json({
    //         message: 'User does not exist'
    //     });
    // }
    //return res.status(200).json(await userRepo.getByColumnName("googleId", String(googleId)));
}