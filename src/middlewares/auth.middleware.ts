import express, { Request, Response, NextFunction } from "express";
import { DecodedIdToken, getAuth } from "firebase-admin/auth";
import { UserService } from "../services/user.service";
import { ForbiddenError } from "../errors/forbidden.error";
import { UnauthorizedError } from "../errors/unauthorized.error";

export const auth = (app: express.Express) => {
    app.use(authMiddleware);
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (isLoginRequest(req)) {
        return next();
    }

    const token = extractToken(req);
    if (!token) {
        return next(new UnauthorizedError());
    }

    try {
        const decodedIdToken = await verifyToken(token);

        const user = await new UserService().getById(decodedIdToken.uid);
        if (!user) {
            return next(new ForbiddenError());
        }
        req.user = user;
        
        return next();
    } catch (error) {
        return next(new UnauthorizedError());        
    }
};

const isLoginRequest = (req: Request) => req.method === "POST" && req.url.startsWith("/auth/login");

const extractToken = (req: Request): string | undefined => {
    const authorizationHeader = req.headers.authorization;
    return authorizationHeader?.split("Bearer ")[1];
}

const verifyToken = (token: string): Promise<DecodedIdToken> => {
    return getAuth().verifyIdToken(token, true)
}
