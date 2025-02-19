import { ErrorBase } from "./base.error";

export class NotFound extends ErrorBase {

    constructor(message: string) {
        super(404, message);
    };
};