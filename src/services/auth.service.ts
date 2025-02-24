import { User } from "../models/user.model";
import { getAuth } from "firebase-admin/auth";

export class AuthService {

    async create(user: User): Promise<string> {
        const auth = getAuth();
        const newUser = await auth.createUser({
            email: user.email,
            password: user.password,
            displayName: user.name
        });

        return newUser.uid;
    }
}
