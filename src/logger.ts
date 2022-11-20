class Logger implements ILogger {
  constructor() {}

  Info(msg: string) {}
}

export interface ILogger {
  Info(msg: string): void;
}

export { Logger };
