import { User } from "../models/user.model";
import { getAuth } from "firebase-admin/auth";
import { EmailAlreadyExistsError } from "../errors/email-already-exists.error";

export class AuthService {

    async create(user: User): Promise<string> {
        const auth = getAuth();
        const newUser = await auth.createUser({
            email: user.email,
            password: user.password,
            displayName: user.name
        }).catch(error => {
            if (error.code === "auth/email-already-exists") {
                throw new EmailAlreadyExistsError();
            }
            throw error;
        });
        return newUser.uid;
    }
}
