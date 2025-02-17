import express, { Request, Response } from "express";

export const userRoutes = express.Router();

type User = {
    id: number;
    name: String;
    email: String;
};

let users: User[] = [];
let id = 0;

userRoutes.get("/users", (req: Request, res: Response) => {
    res.send(users);
});

userRoutes.get("/users/:id", (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const user = users.find(user => user.id === userId);
    res.send(user);
});

userRoutes.post("/users", (req: Request, res: Response) => {
    const user = req.body;
    user.id = ++id;
    users.push(user);
    res.send({
        message: "Usuário criado com sucesso!"
    });
});

userRoutes.put("/users/:id", (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const userUpdate = req.body;
    const index = users.findIndex((user: User) => user.id === userId);
    users[index].name = userUpdate.name;
    users[index].email = userUpdate.email;
    res.send({
        message: "Usuário alterado com sucesso!"
    });
});

userRoutes.delete("/users/:id", (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const index = users.findIndex((user: User) => user.id === userId)
    users.splice(index, 1);
    res.send({
        message: "Usuário excluído com sucesso!"
    });
});
