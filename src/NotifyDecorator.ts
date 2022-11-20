import { INotifer } from './Notifier';
import { IAuth } from './AuthenticationService';

export class NotifyDecorator implements IAuth {
  constructor(
    private _notification: INotifer,
    private _authentication: IAuth
  ) {}

  async isVaild(
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean> 
  {
    console.log({
      accountId,
    });

    const result = await this._authentication.isVaild(accountId, password, otp);

    if (!result) {
      await this._notification.notify(accountId);
    }

    return result;
  }
}


export function NotifyDecorator2( _authentication:IAuth,_notification: INotifer ): IAuth{
  return {
    ..._authentication,
    'isVaild':async (accountId,password,otp)=>{
      const isVaild =  await  _authentication.isVaild(accountId, password, otp)
 
      if (!isVaild){
        _notification.notify(accountId)
      }
    
      return isVaild
    }
  }

}