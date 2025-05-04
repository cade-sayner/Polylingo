import { Express } from 'express';
import { UserRepository } from '../repositories/user-repository';
import jwt from 'jsonwebtoken';

const userRepo = new UserRepository("users", "user_id")

export function registerAuthRoutes(app: Express) {
    app.get("/auth/login", login);
}

async function login(req: any, res: any) {
    let code = req.query.code as string | undefined;
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

    if (!response.ok) {
        return res.status(500).json({ message: "Something went wrong trying to log you in" });
    }

    // TODO: make a type for the google response and assert the type it here
    const data = await response.json();

    // create a user here if one does not yet exist
    const claims = jwt.decode(data.id_token) as { sub?: string, email?: string, name?: string };

    if (claims?.sub && claims?.name && claims?.email) {
        const exists = await userRepo.Exists(claims.sub as string);
        if (!exists) {
            // create a new user
            try {
                userRepo.create({
                    userId: null,
                    email: claims.email,
                    name: claims.name,
                    googleId: claims.sub
                })
            } catch {
                return res.status(500).json({
                    message: "Error creating user when logging in for the first time"
                })
            }
            // TODO: Assign a default role to the user as well
        }

    } else {
        return res.status(500).json({
            message: "The jwt returned from google was malformed"
        })
    }

    return res.status(200).json({
        jwt: data.id_token
    })
}