import { AuthService } from "./auth.service";
import { User } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { NotFoundError } from "../errors/not-found.error";

export class UserService {

    private userRepository: UserRepository;
    private authService: AuthService;

    constructor() {
        this.userRepository = new UserRepository();
        this.authService = new AuthService();
    }

    async getAll(): Promise<User[]> {
        const users = await this.userRepository.getAll();

        if (users.length === 0) {            
            throw new NotFoundError("Nenhum usuário encontrado.");
        }
        return users;
    }

    async getById(id: string): Promise<User> {
        const user = await this.userRepository.getById(id);
        
        if (!user) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${id}.`)
        }
        return user;
    }

    async save(user: User): Promise<void> {
        const uid = await this.authService.create(user);
        const newUser = { ...user, id: uid };
        await this.userRepository.save(newUser);
    }

    async update(id: string, user: User): Promise<void> {        
        const _user = await this.userRepository.getById(id);
        
        if (!_user) {
            throw new NotFoundError(`Não há nenhum usuário cadastrado com o ID ${id}.`);
        }

        _user.name = user.name;
        _user.email = user.email;

        await this.userRepository.update(_user);
    }

    async delete(id: string): Promise<void> {        
        return this.userRepository.delete(id);
    }
}
