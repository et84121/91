import { IFailedCounter } from './FailedCounter';
import { IAuth } from './AuthenticationService';


export class FailedCounterDecorator implements IAuth
{
  constructor (
    private _failedCounter: IFailedCounter,
    private _authentication: IAuth
  ) { }

  async isVaild (
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean>
  {
    const isLock = await this._failedCounter.isLocked( accountId );
    if ( isLock )
    {
      throw new Error( 'account is locked' );
    }

    return await this._authentication.isVaild( accountId, password, otp );
  }
}
