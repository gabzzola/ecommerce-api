import express, { NextFunction, Request, Response } from "express";
import { errors } from "celebrate";
import { NotFoundError } from "../errors/not-found.error";
import { InternalServerError } from "../errors/internal-server.error";

export const errorHandler = (app: express.Express) => {
    app.use(errors());
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {        
        if (error instanceof NotFoundError) {
            return error.send(res);
        }

        new InternalServerError().send(res);    
    });
}
