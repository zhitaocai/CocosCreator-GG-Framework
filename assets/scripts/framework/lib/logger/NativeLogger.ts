import { LoggerInterface, LoggerOption } from "./LoggerInterface";

/**
 * 原生日志输出管理器
 *
 * 会将 [object object] 转换为 object Json 化后的结果
 *
 * @author caizhitao
 * @created 2020-11-26 22:52:46
 */
export default class NativeLogger implements LoggerInterface {
    private _option: LoggerOption = null;

    init(option: LoggerOption): void {
        this._option = option;
    }

    log(...args: any[]) {
        this._option && this._option.enableLog && console.info(this._format(args));
    }

    debug(...args: any[]): void {
        this._option && this._option.enableLog && console.debug(this._format(args));
    }

    info(...args: any[]): void {
        this._option && this._option.enableLog && console.info(this._format(args));
    }

    error(...args: any[]) {
        this._option && this._option.enableLog && console.error(this._format(args));
    }

    warn(...args: any[]) {
        this._option && this._option.enableLog && console.warn(this._format(args));
    }

    /**
     * 原生平台上不能直接打印object和array，因此这里将object和array转换为字符串进行输出，方便在 Android Logcat 中直接看 log 结果
     */
    private _format(...args: any[]): string {
        let msg: string = "";
        args.forEach((value: any, index: number, array: any[]) => {
            if (value == null) {
                msg += "null";
            } else {
                const valType = typeof value;
                if (valType === "string" || valType === "number") {
                    msg += value;
                } else {
                    msg += JSON.stringify(value);
                }
            }
            if (index + 1 < array.length) {
                msg += ",";
            }
        });
        return msg;
    }
}
