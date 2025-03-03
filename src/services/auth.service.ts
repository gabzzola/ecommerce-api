import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getAuth as getFirebaseAuth, signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import { User } from "../models/user.model";
import { EmailAlreadyExistsError } from "../errors/email-already-exists.error";
import { UnauthorizedError } from "../errors/unauthorized.error";

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

    async login(email: string, password: string): Promise<UserCredential> {
        return await signInWithEmailAndPassword(getFirebaseAuth(), email, password)
        .catch(error => {
            if (error.code === "auth/invalid-credential") {
                throw new UnauthorizedError();
            }
            throw error;
        });
    }
}
