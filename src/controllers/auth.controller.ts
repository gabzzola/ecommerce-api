import { Request, Response } from "express-serve-static-core";
import { AuthService } from "../services/auth.service";


export class AuthController {

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const UserRecord = await new AuthService().login(email, password);
        const JWT = await UserRecord.user.getIdToken();
        res.send({ token: JWT })
    }
}
