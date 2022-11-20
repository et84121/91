export class OTPAdapter implements IOtp {
  async GetCurrentOtp ( accountId: string )
  {
    const otpFromData = new FormData();
    otpFromData.append( 'account', accountId );
    const otpRes = await fetch( 'api/otp', {
      method: 'POST',
      body: otpFromData
    } );

    if ( !otpRes.ok )
    {
      throw new Error( `web api error, accountId:${ accountId }` );
    }

    const currentOTP = ( await otpRes.json() )[ 'data' ] as string;
    return currentOTP;
  }
}

export interface IOtp {
  GetCurrentOtp(accountId: string): Promise<string>;
}
