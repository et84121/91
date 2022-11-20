import { SlackClient } from './libs/slackClient';

export class SlackAdaptor implements INotifer {
  async notify ( accountId: string )
  {
    const message = `account:${ accountId } try to login failed`;
    const slackClient = new SlackClient( 'my api token' );

    await slackClient.PostMessage( ( res ) => { }, 'my channel', message, 'my bot name' );
  }
}

export interface INotifer {
  notify(accountId: string): Promise<void>;
}
