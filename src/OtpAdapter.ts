export class OTPAdapter implements IOtp {
  async getCurrentOtp ( accountId: string )
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
  getCurrentOtp(accountId: string): Promise<string>;
}
