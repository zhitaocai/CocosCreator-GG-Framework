import { LoggerInterface, LoggerOption } from "./LoggerInterface";

/**
 * @author caizhitao
 * @created 2020-11-26 22:52:45
 */
export default class CCLogger implements LoggerInterface {
    private _option: LoggerOption = null;

    init(option: LoggerOption): void {
        this._option = option;
    }

    log(...args: any[]): void {
        this._option && this._option.enableLog && console.log.apply(null, args);
    }

    debug(...args: any[]): void {
        this._option && this._option.enableLog && console.debug.apply(null, args);
    }

    info(...args: any[]): void {
        this._option && this._option.enableLog && console.info.apply(null, args);
    }

    warn(...args: any[]): void {
        this._option && this._option.enableLog && console.warn.apply(null, args);
    }

    error(...args: any[]): void {
        this._option && this._option.enableLog && console.error.apply(null, args);
    }
}
