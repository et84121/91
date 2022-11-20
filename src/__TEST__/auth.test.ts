import { describe, expect, it, jest } from '@jest/globals';
import { AuthenticationService, IAuth } from '../AuthenticationService';
import { FailedCounterDecorator } from '../decorator/FailedCounterDecorator';
import { LogDecorator } from '../decorator/LogDecorator';
import { NotifyDecorator } from '../decorator/NotifyDecorator';
import { FailedCounter } from '../FailedCounter';
import { HashAdapter } from '../HashAdapter';
import { Logger } from '../Logger';
import { SlackAdaptor } from '../Notifier';
import { OTPAdapter } from '../OtpAdapter';
import { ProfileRepo } from '../ProfileRepo';

// 這裡是 Jest 與 TypeScript 撘配的地雷
// 注意 Setup() 裡的 jest.mocked()，它並沒有實際的作用，只是幫忙加上 type 讓 auto complete 得以出現
// 下方的 jest.mock() 才是 mock 掉其它 module 的關鍵
jest.mock('../FailedCounter');
jest.mock('../hashAdapter');
jest.mock('../logger');
jest.mock('../Notifier');
jest.mock('../OtpAdapter');
jest.mock('../ProfileRepo');

function setup() {
  const hash = jest.mocked(new HashAdapter());

  const otp = jest.mocked(new OTPAdapter());

  const profileRepo = jest.mocked(new ProfileRepo());

  const failedCounter = jest.mocked(new FailedCounter());

  const logger = jest.mocked(new Logger());

  const notifier = jest.mocked(new SlackAdaptor());

  let authenticator: IAuth = new AuthenticationService(
    hash,
    otp,
    profileRepo,
    failedCounter
  );

  authenticator = new FailedCounterDecorator(authenticator, failedCounter);
  authenticator = new LogDecorator(authenticator, failedCounter, logger);
  authenticator = new NotifyDecorator(authenticator, notifier);

  function quickArrange() {
    const accountId = 'Bunny';
    const password = 'hashedPassword';
    const otpStr = '123';

    profileRepo.GetPassword.mockResolvedValueOnce(password);
    otp.GetCurrentOtp.mockResolvedValueOnce(otpStr);
    hash.HashString.mockResolvedValueOnce(password);
    failedCounter.IsLocked.mockResolvedValueOnce(false);
    failedCounter.ResetFailCount.mockResolvedValueOnce();
    failedCounter.AddFailCount.mockResolvedValueOnce();
    notifier.Notify.mockResolvedValueOnce();

    return {
      accountId,
      password,
      otpStr,
    };
  }

  return {
    authenticator,
    hash,
    otp,
    profileRepo,
    failedCounter,
    logger,
    notifier,

    quickArrange,
  } as const;
}
describe('AuthenticationService', function () {
  it('Vaild', async () => {
    // Arrange
    const { authenticator, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();

    // Act
    const isVaild = await authenticator.isVaild(accountId, password, otpStr);

    // Assert
    expect(isVaild).toBe(true);
  });

  it('should failed when password is invalid', async () => {
    // Arrange
    const wrongPassword = '5566';
    const { authenticator, hash, quickArrange } = setup();
    hash.HashString.mockResolvedValueOnce(wrongPassword);
    const { accountId, password, otpStr } = quickArrange();
    
    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      wrongPassword,
      otpStr
    );

    // Assert
    expect(password !== wrongPassword).toBe(true);
    expect(isVaild).toBe(false);
  });

  it('should failed when otpStr is invalid', async () => {
    // Arrange
    const { authenticator, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();
    const wrongOtp = '5566';

    // Act
    const isVaild = await authenticator.isVaild(accountId, password, wrongOtp);

    // Assert
    expect(otpStr !== wrongOtp).toBe(true);
    expect(isVaild).toBe(false);
  });

  it('account is locked', async () => {
    const { authenticator, failedCounter } = setup();

    failedCounter.IsLocked.mockResolvedValueOnce(true);

    expect(async () => {
      await authenticator.isVaild('aaaa', '1234', '');
    }).rejects.toThrow(/locked/);
  });

  it('check decorator order when invalid', async () => {
    // Arrange
    const { authenticator, failedCounter, logger, notifier, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();
    const wrongOtp = '5566';

    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      password,
      wrongOtp
    );

    // Assert
    expect(otpStr !== wrongOtp).toBe(true);
    expect(isVaild).toBe(false);
    expect(failedCounter.AddFailCount.mock.invocationCallOrder[0]).toBeLessThan(logger.Info.mock.invocationCallOrder[0])
    expect(logger.Info.mock.invocationCallOrder[0]).toBeLessThan(notifier.Notify.mock.invocationCallOrder[0])
  });

  it('should reset failed count when valid', async () => {
    // Arrange
    const { authenticator, failedCounter, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();

    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      password,
      otpStr
    );

    // Assert
    expect(failedCounter.ResetFailCount).toHaveBeenLastCalledWith(accountId)
  });

  it('should add failed count when invalid', async () => {
    // Arrange
    const { authenticator, failedCounter, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();
    const wrongOtp = '5566';


    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      password,
      wrongOtp
    );

    // Assert
    expect(wrongOtp !== otpStr).toBe(true);
    expect(failedCounter.AddFailCount).toHaveBeenLastCalledWith(accountId)
  });

  it('should notify user when invalid', async () => {
    // Arrange
    const { authenticator, notifier, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();
    const wrongOtp = '5566';


    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      password,
      wrongOtp
    );

    // Assert
    expect(wrongOtp !== otpStr).toBe(true);
    expect(notifier.Notify).toHaveBeenLastCalledWith(accountId)
  });

  it('should log current failed count when invalid', async () => {
    // Arrange
    const { authenticator, logger, quickArrange } = setup();
    const { accountId, password, otpStr } = quickArrange();
    const wrongOtp = '5566';


    // Act
    const isVaild = await authenticator.isVaild(
      accountId,
      password,
      wrongOtp
    );

    // Assert
    expect(wrongOtp !== otpStr).toBe(true);
    expect(logger.Info).toHaveBeenCalled()
  });
});
