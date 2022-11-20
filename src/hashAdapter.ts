export class hashAdapter implements IHash {
  async hashPassword ( password: string )
  {
    const encoder = new TextEncoder();
    const data = encoder.encode( password );
    const hash = await crypto.subtle.digest( 'SHA-256', data );

    const hashedPassword = btoa(
      String.fromCharCode.apply( null, Array.from( new Uint8Array( hash ) ) )
    );
    return hashedPassword;
  }
}

export interface IHash {
  hashPassword(password: string): Promise<string>;
}
