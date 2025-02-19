import { NextFunction, Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { ValidationError } from "../errors/validation.error";

type User = {
    name: string;
    email: string;
};

export class UserController {

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const snapshot = await getFirestore().collection("users").get();
            const users = snapshot.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                };
            });
            res.send(users);
        } catch (error) {
            next(error);
        };
    };

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const doc = await getFirestore().collection("users").doc(userId).get();
            res.send({
                id: doc.id,
                ...doc.data()
            });
        } catch (error) {
            next(error);
        };
    };

    static async save(req: Request, res: Response, next: NextFunction) {
        try {            
            const user = req.body;

            if (!user.name) {
                throw new ValidationError("O nome é obrigatório!")
            };
            if (!user.email) {
                throw new ValidationError("O email é obrigatório!")
            };
            
            const savedUser = await getFirestore().collection("users").add(user);
            res.status(201).send({
                message: `Usuário ${savedUser.id} criado com sucesso!`
            });
        } catch (error) {
            next(error);
        };
    };

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            const user = req.body as User;
            await getFirestore().collection("users").doc(userId).set({
                name: user.name,
                email: user.email
            });
            res.send({
                message: "Usuário alterado com sucesso!"
            });
        } catch (error) {
            next(error);
        };
    };

    static async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id;
            await getFirestore().collection("users").doc(userId).delete();
            res.status(204).end();
        } catch (error) {
            next(error);
        };
    };
};
