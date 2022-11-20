export class FailedCounter implements IFailedCounter {
  async resetFailCount ( accountId: string )
  {
    const failedCounterRes = await fetch( 'api/failedCounter/Reset', {
      body: new URLSearchParams( { account: accountId } )
    } );
    if ( !failedCounterRes.ok )
    {
      throw new Error( 'add failed counter error' );
    }
  }

  async addFailCount ( accountId: string )
  {
    const failedCounterRes = await fetch( 'api/failedCounter/Add', {
      body: new URLSearchParams( { account: accountId } )
    } );
    if ( !failedCounterRes.ok )
    {
      throw new Error( 'add failed counter error' );
    }
  }

  async isLocked ( account: string )
  {
    const isLockedRes = await fetch( 'api/failedCounter/isLock', {
      method: 'GET',
      body: new URLSearchParams( { account } )
    } );
    return isLockedRes.ok;
  }
}

export interface IFailedCounter {
  resetFailCount(accountId: string): Promise<void>;
  addFailCount(accountId: string): Promise<void>;
  isLocked(account: string): Promise<boolean>;
}
