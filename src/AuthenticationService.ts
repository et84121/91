import { IFailedCounter } from './FailedCounter';
import { IHash } from './hashAdapter';
import { ILogger } from './logger';
import { IOtp } from './OtpAdapter';
import { IProfileRepo } from './ProfileRepo';

export class AuthenticationService implements IAuth {
  constructor(
    private _hash: IHash,
    private _otp: IOtp,
    private _profileRepo: IProfileRepo,
    private _failedCounter: IFailedCounter,
    private _logger: ILogger
  ) {}

  async isVaild(
    accountId: string,
    password: string,
    otp: string
  ): Promise<boolean> {

    // setup db connection
    const passwordFromDB = await this._profileRepo.getPasswordFromDb(accountId);

    // setup crypt service
    const hashedPassword = await this._hash.hashPassword(password);

    // Get Account One Time Password
    const currentOTP = await this._otp.getCurrentOtp(accountId);

    if (!(passwordFromDB !== hashedPassword || currentOTP !== otp)) {
      // reset failed counter
      await this._failedCounter.resetFailCount(accountId);

      return true;
    } else {
      await this.LogCurrentFailedCount(accountId);
      return false;
    }
  }

  private async LogCurrentFailedCount(accountId: string) {
    await this._failedCounter.addFailCount(accountId);
    this._logger.Info(`accountId:${accountId} failed times:{failedCount}`);
  }
}

export interface IAuth {
  isVaild(accountId: string, password: string, otp: string): Promise<boolean>;
}
