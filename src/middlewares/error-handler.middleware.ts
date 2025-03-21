import express, { NextFunction, Request, Response } from "express";
import { errors } from "celebrate";
import { ErrorBase } from "../errors/base.error";
import { InternalServerError } from "../errors/internal-server.error";

export const errorHandler = (app: express.Express) => {
    app.use(errors());
    app.use((error: Error, req: Request, res: Response, next: NextFunction) => {        
        console.log(error);

        if (error instanceof ErrorBase) {
            return error.send(res);
        }
        new InternalServerError().send(res);    
    });
}
