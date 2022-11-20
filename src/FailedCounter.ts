export class FailedCounter implements IFailedCounter {
  async GetCurrentFailedCount ( accountId: string ): Promise<number>
  {
    const response = await fetch( 'api/failedCounter/count', {
      body: new URLSearchParams( { account: accountId } )
    } );
    if ( !response.ok )
    {
      throw new Error( 'add failed counter error' );
    }

    const count = (await response.json())['data'] as number

    return count
  }
  async ResetFailCount ( accountId: string )
  {
    const response = await fetch( 'api/failedCounter/Reset', {
      body: new URLSearchParams( { account: accountId } )
    } );
    if ( !response.ok )
    {
      throw new Error( 'add failed counter error' );
    }
  }

  async AddFailCount ( accountId: string )
  {
    const response = await fetch( 'api/failedCounter/Add', {
      body: new URLSearchParams( { account: accountId } )
    } );
    if ( !response.ok )
    {
      throw new Error( 'add failed counter error' );
    }
  }

  async IsLocked ( account: string )
  {
    const response = await fetch( 'api/failedCounter/isLock', {
      method: 'GET',
      body: new URLSearchParams( { account } )
    } );
    return response.ok;
  }
}

export interface IFailedCounter {
  GetCurrentFailedCount (accountId: string): Promise<number>;
  ResetFailCount(accountId: string): Promise<void>;
  AddFailCount(accountId: string): Promise<void>;
  IsLocked(account: string): Promise<boolean>;
}
