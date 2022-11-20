import { injectable, inject } from "inversify";
import "reflect-metadata";

import { FailedCounter, IFailedCounter } from './FailedCounter';
import { HashAdapter, IHash } from './HashAdapter';
import { IOtp, OTPAdapter } from './OtpAdapter';
import { IProfileRepo, ProfileRepo } from './ProfileRepo';

@injectable()
export class AuthenticationService implements IAuth {
  constructor(
    @inject(HashAdapter) private _hash: IHash,
    @inject(OTPAdapter) private _otp: IOtp,
    @inject(ProfileRepo) private _profileRepo: IProfileRepo,
    @inject(FailedCounter) private _failedCounter: IFailedCounter
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