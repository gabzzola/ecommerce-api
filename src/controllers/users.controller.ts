import { Request, Response } from "express";
import { getFirestore } from "firebase-admin/firestore";

type User = {
    name: String;
    email: String;
};

export class UserController {
    
    static async getAll(req: Request, res: Response) {
        const snapshot = await getFirestore().collection("users").get();
        const users = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        });        
        res.send(users);
    };

    static async getById(req: Request, res: Response) {
        const userId = req.params.id;
        const doc = await getFirestore().collection("users").doc(userId).get();
        
        res.send({
            id: doc.id, 
            ...doc.data()
        });
    };

    static async save(req: Request, res: Response) {
        const user = req.body;
        const savedUser = await getFirestore().collection("users").add(user);

        res.send({
            message: `Usuário ${savedUser.id} criado com sucesso!`
        });
    };

    static async update(req: Request, res: Response) {
        const userId = req.params.id;
        const user = req.body as User;

        await getFirestore().collection("users").doc(userId).set({
            name: user.name,
            email: user.email
        });

        res.send({
            message: "Usuário alterado com sucesso!"
        });             
    };

    static async delete(req: Request, res: Response) {
        const userId = req.params.id;
        
        await getFirestore().collection("users").doc(userId).delete();

        res.send({
            message: "Usuário excluído com sucesso!"
        });
    };
};
