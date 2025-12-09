import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(level: string, message: any, optionalParams: any[]): string {
    const data = {
      timestamp: new Date().toISOString(),
      level,
      message: this.stringifyValue(message),
      ...(optionalParams.length > 0
        ? { params: JSON.stringify(optionalParams) }
        : {}),
    };

    return Object.entries(data)
      .map(([key, value]) => `${key}=${value}`)
      .join('\t');
  }

  private stringifyValue(value: any): string {
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}