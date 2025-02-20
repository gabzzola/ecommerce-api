import { getFirestore } from "firebase-admin/firestore";
import { User } from "../models/user.model";
import { NotFoundError } from "../errors/not-found.error";

export class UserService {

    async getAll(): Promise<User[]> {
        const snapshot = await getFirestore().collection("users").get();

        if (snapshot.empty) {
            throw new NotFoundError("Nenhum usuário encontrado.");
        }

        return snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data()
            };
        }) as User[];
    }

    async getById(id: string): Promise<User> {
        const doc = await getFirestore().collection("users").doc(id).get();    
        
        if (!doc.exists) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${id}.`)
        }

        return {
            id: doc.id,
            ...doc.data()
        } as User;
    }

    async save(user: User): Promise<void> {
        await getFirestore().collection("users").add(user);        
    }

    async update(id: string, user: User): Promise<void> {        
        const docRef = getFirestore().collection("users").doc(id);

        const doc = await docRef.get();
        if (!doc.exists) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${id}.`);
        }

        await docRef.update({ 
            name: user.name,
            email: user.email 
        });
    }

    async delete(id: string): Promise<void> {        
        await getFirestore().collection("users").doc(id).delete();
    }
}