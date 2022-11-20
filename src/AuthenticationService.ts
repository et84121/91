import { IFailedCounter } from './FailedCounter';
import { IHash } from './HashAdapter';
import { IOtp } from './OtpAdapter';
import { IProfileRepo } from './ProfileRepo';

export class AuthenticationService implements IAuth {
  constructor(
    private _hash: IHash,
    private _otp: IOtp,
    private _profileRepo: IProfileRepo,
    private _failedCounter: IFailedCounter
  ) {}

  async isVaild(
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean> {    
    const hashedPasswordFromDB = await this._profileRepo.GetPassword(accountId);

    const hashedPassword = await this._hash.HashString(password);

    // Get Account One Time Password
    const currentOTP = await this._otp.GetCurrentOtp(accountId);

    if (hashedPasswordFromDB === hashedPassword && currentOTP === otp) {
      // reset failed counter
      await this._failedCounter.ResetFailCount(accountId);
      return true;
    } else {
      await this._failedCounter.AddFailCount(accountId);
      return false;
    }
  }

 
}

export interface IAuth {
  isVaild(accountId: string, password: string, otp: string): Promise<boolean>;
}