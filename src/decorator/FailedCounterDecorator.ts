import { IFailedCounter } from '../FailedCounter';
import { IAuth } from '../AuthenticationService';
import { AuthenticationDecoratorBase } from './AuthenticationDecoratorBase';


export class FailedCounterDecorator extends AuthenticationDecoratorBase
{
  private _failedCounter: IFailedCounter

  constructor (
    authentication: IAuth,
    failedCounter: IFailedCounter
  ) {
    super(authentication)
    this._failedCounter = failedCounter
   }

  async isVaild (
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean>
  {
    const isLock = await this._failedCounter.IsLocked( accountId );
    if ( isLock )
    {
      throw new Error( 'account is locked' );
    }

    return await this._authentication.isVaild( accountId, password, otp );
  }
}
