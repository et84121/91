class SlackClient {
  private readonly api: string;

  constructor(api: string) {
    this.api = api;
  }

  async PostMessage(
    callback: (res: any) => Promise<void> | void,
    channelName: string,
    message: string,
    botName: string
  ) {
    return;
  }
}

export { SlackClient };
