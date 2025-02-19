import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";
import { NotFoundError } from "../errors/not-found.error";
import { ValidationError } from "../errors/validation.error";

type User = {
    name: string;
    email: string;
};

export class UserController {

    static async getAll(req: Request, res: Response) {
        const snapshot = await getFirestore().collection("users").get();

        if (snapshot.empty) {
            throw new NotFoundError("Nenhum usuário encontrado.");
        }

        const users = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });
        res.send(users);
    }

    static async getById(req: Request, res: Response) {
        const userId = req.params.id;
        const doc = await getFirestore().collection("users").doc(userId).get();
        
        if (!doc.exists) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${userId}.`)
        }

        res.send({
            id: doc.id,
            ...doc.data()
        });
    }

    static async save(req: Request, res: Response) {
        const user = req.body as User;

        if (!user.name) {
            throw new ValidationError("O nome é obrigatório!");
        }
        if (!user.email) {
            throw new ValidationError("O email é obrigatório!");
        }
        
        const savedUser = await getFirestore().collection("users").add(user);
        res.status(201).send({
            message: `Usuário ${savedUser.id} criado com sucesso!`
        });
    }

    static async update(req: Request, res: Response) {
        const userId = req.params.id;
        const user = req.body as User;
        const docRef = getFirestore().collection("users").doc(userId);

        const doc = await docRef.get();
        if (!doc.exists) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${userId}.`);
        }

        await docRef.update({
            name: user.name,
            email: user.email
        });

        res.send({
            message: `Usuário ${userId} alterado com sucesso!`,            
        });
    }

    static async delete(req: Request, res: Response) {
        const userId = req.params.id;
        await getFirestore().collection("users").doc(userId).delete();
        res.status(204).end();
    }
}
