import { User } from "../models/user.model";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getAuth as getFirebaseAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { EmailAlreadyExistsError } from "../errors/email-already-exists.error";

export class AuthService {

    async create(user: User): Promise<string> {
        const auth = getAdminAuth();
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

    login(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    }
}
