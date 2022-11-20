import { injectable } from "inversify";

@injectable()
export class HashAdapter implements IHash {
  async HashString ( password: string )
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
  HashString(password: string): Promise<string>;
}
