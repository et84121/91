import { describe, expect, it, jest } from '@jest/globals';
import { AuthenticationService, IAuth } from '../AuthenticationService';
import { FailedCounterDecorator } from '../FailedCounterDecorator';
import { NotifyDecorator } from '../NotifyDecorator';
import { FailedCounter } from '../FailedCounter';
import { hashAdapter } from '../hashAdapter';
import { Logger } from '../logger';
import { SlackAdaptor } from '../Notifier';
import { OTPAdapter } from '../OtpAdapter';
import { ProfileRepo } from '../ProfileRepo';

jest.mock('../FailedCounter');
jest.mock('../hashAdapter');
jest.mock('../logger');
jest.mock('../Notifier');
jest.mock('../OtpAdapter');
jest.mock('../ProfileRepo');

function setup() {
  const hash = jest.mocked(new hashAdapter());

  const otp = jest.mocked(new OTPAdapter());

  const profileRepo = jest.mocked(new ProfileRepo());

  const failedCounter = jest.mocked(new FailedCounter());

  const logger = jest.mocked(new Logger());

  const notifier = jest.mocked(new SlackAdaptor());

  let authenticator: IAuth = new AuthenticationService(
    hash,
    otp,
    profileRepo,
    failedCounter,
    logger
  );

  authenticator = new FailedCounterDecorator(failedCounter, authenticator);
  authenticator = new NotifyDecorator(notifier, authenticator);

  function whenVaild() {
    profileRepo.getPasswordFromDb.mockResolvedValueOnce('hasedPassword');
    otp.getCurrentOtp.mockResolvedValueOnce('123');
    hash.hashPassword.mockResolvedValueOnce('hasedPassword');
    failedCounter.isLocked.mockResolvedValueOnce(false);
    failedCounter.resetFailCount.mockResolvedValueOnce();
    failedCounter.addFailCount.mockResolvedValueOnce();
    notifier.notify.mockResolvedValueOnce();
  }

  return {
    authenticator,
    hash,
    otp,
    profileRepo,
    failedCounter,
    logger,
    notifier,

    whenVaild,
  } as const;
}
describe('auth', function () {
  it('isVaild', async () => {
    const { authenticator, whenVaild } = setup();

    whenVaild();

    const result = await authenticator.isVaild('aaaa', 'hasedPassword', '123');
    expect(result).toBe(true);
  });

  it('account is locked', async () => {
    const { authenticator, failedCounter } = setup();

    failedCounter.isLocked.mockResolvedValueOnce(true);

    expect(async () => {
      await authenticator.isVaild('aaaa', '1234', '');
    }).rejects.toThrow(/locked/);
  });
});
