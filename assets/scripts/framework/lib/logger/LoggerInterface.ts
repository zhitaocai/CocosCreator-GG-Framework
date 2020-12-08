/**
 * 日志接口
 *
 * @author caizhitao
 * @created 2020-11-26 23:19:21
 */
export interface LoggerInterface {
    /**
     * 初始化日志
     *
     * @param option 参数选项
     */
    init(option: LoggerOption): void;
    log(...args: any[]): void;
    debug(...args: any[]): void;
    info(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}

export interface LoggerOption {
    /**
     * 是否允许输出log
     */
    enableLog: boolean;
}
