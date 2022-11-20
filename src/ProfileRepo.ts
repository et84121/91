import { injectable } from 'inversify';
import { setupDB } from './libs/db';

@injectable()
export class ProfileRepo implements IProfileRepo {
  async GetPassword ( account: string )
  {
    const db = await setupDB();

    // Get account password from database
    const acctFromDb = await db.get( 'users', account );
    const passwordFromDB = acctFromDb?.hasedPassword;
    return passwordFromDB;
  }
}

export interface IProfileRepo {
  GetPassword(account: string): Promise<string| undefined>;
}
