import { INotifer } from '../Notifier';
import { IAuth } from '../AuthenticationService';
import { AuthenticationDecoratorBase } from './AuthenticationDecoratorBase';

export class NotifyDecorator extends AuthenticationDecoratorBase {
  private _notification: INotifer
  
  constructor(
    authentication: IAuth,
    notification: INotifer
  ) {
    super(authentication);
    this._notification = notification;
  }

  async isVaild(
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean> 
  {
    const result = await this._authentication.isVaild(accountId, password, otp);

    if (!result) {
      await this._notification.Notify(accountId);
    }

    return result;
  }
}


/**
 * 
 * alternative implementation of authentication decorator
 * 
 * @param _authentication 
 * @param _notification 
 * @returns 
 */
export function NotifyDecorator2( _authentication:IAuth,_notification: INotifer ): IAuth{
  return {
    ..._authentication,
    'isVaild':async (accountId,password,otp)=>{
      const isVaild =  await  _authentication.isVaild(accountId, password, otp)
 
      if (!isVaild){
        _notification.Notify(accountId)
      }
    
      return isVaild
    }
  }

}