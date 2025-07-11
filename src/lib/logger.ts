enum LogLevel {
  VERBOSE = 0,
  DEBUG = 1,
  INFO = 2,
  WARNING = 3,
  ERROR = 4
}

type LogParams = Parameters<typeof console.log>;

interface HandleOpts {
  level: LogLevel;
  fn?: 'log' | 'warn' | 'error';
  message: LogParams;
}

export class Logger {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  #handler(opts: HandleOpts) {
    const { fn = 'log', level, message } = opts;
    console[fn](`[${level}] [${this.#name}]`, ...message);
  }

  verbose(...opts: LogParams) {
    this.#handler({
      level: LogLevel.VERBOSE,
      message: opts
    });
  }

  debug(...opts: LogParams) {
    this.#handler({
      level: LogLevel.DEBUG,
      message: opts
    });
  }

  info(...opts: LogParams) {
    this.#handler({
      level: LogLevel.INFO,
      message: opts
    });
  }

  warning(...opts: LogParams) {
    this.#handler({
      level: LogLevel.WARNING,
      message: opts,
      fn: 'warn'
    });
  }

  error(...opts: LogParams) {
    this.#handler({
      level: LogLevel.ERROR,
      message: opts,
      fn: 'error'
    });
  }
}
