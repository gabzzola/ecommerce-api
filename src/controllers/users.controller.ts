import { Request, Response } from "express";

type User = {
    id: number;
    name: String;
    email: String;
};

let users: User[] = [];
let id = 0;

export class UserController {
    static getAll(req: Request, res: Response) {
        res.send(users);
    };

    static getById(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const user = users.find(user => user.id === userId);
        res.send(user);
    };

    static save(req: Request, res: Response) {
        const user = req.body;
        user.id = ++id;
        users.push(user);
        res.send({
            message: "Usuário criado com sucesso!"
        });
    };

    static update(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const userUpdate = req.body;
        const index = users.findIndex((user: User) => user.id === userId);
        users[index].name = userUpdate.name;
        users[index].email = userUpdate.email;
        res.send({
            message: "Usuário alterado com sucesso!"
        });             
    };

    static delete(req: Request, res: Response) {
        const userId = Number(req.params.id);
        const index = users.findIndex((user: User) => user.id === userId)
        users.splice(index, 1);
        res.send({
            message: "Usuário excluído com sucesso!"
        });
    }
};
