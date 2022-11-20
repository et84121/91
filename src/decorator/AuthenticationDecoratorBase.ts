import { IAuth } from "../AuthenticationService";


export abstract class AuthenticationDecoratorBase implements IAuth {
    constructor(
        protected _authentication: IAuth
    )
    {}
    
    isVaild(accountId: string, password: string, otp: string): Promise<boolean> {
        throw new Error('not yet implements')
    }
}