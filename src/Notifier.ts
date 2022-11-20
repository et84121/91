import { injectable } from 'inversify';
import { SlackClient } from './libs/slackClient';

@injectable()
export class SlackAdaptor implements INotifer {
  async Notify ( accountId: string )
  {
    const message = `account:${ accountId } try to login failed`;
    const slackClient = new SlackClient( 'my api token' );

    await slackClient.PostMessage( ( res ) => { }, 'my channel', message, 'my bot name' );
  }
}

export interface INotifer {
  Notify(accountId: string): Promise<void>;
}
