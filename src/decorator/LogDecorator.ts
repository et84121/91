import { IAuth } from "../AuthenticationService";
import { IFailedCounter } from "../FailedCounter";
import { ILogger } from "../logger";
import { AuthenticationDecoratorBase } from "./AuthenticationDecoratorBase";

export class LogDecorator extends AuthenticationDecoratorBase {
    private _failedCounter:IFailedCounter;
    private _logger:ILogger;
    constructor(authentication:IAuth, failedCounter: IFailedCounter,logger:ILogger){
        super(authentication);
        this._failedCounter = failedCounter;
        this._logger = logger;
    }

    async isVaild(accountId: string, password: string, otp: string): Promise<boolean> {
        const isVaild = await this._authentication.isVaild(accountId, password, otp)

        if(!isVaild){
            const failedCount = await this._failedCounter.GetCurrentFailedCount(accountId)
            this._logger.Info(`accountId:${accountId} failed times:${failedCount}`);
        }

        return isVaild;
    }

}