/**
 * 事件管理器接口，支持以下函数：
 *
 * * emit()：发送事件
 * * onOnce()：注册事件（回调一次后自动销毁）
 * * on()：注册事件
 * * off()：注销事件
 * * offTarget()：注释指定对象下的所有事件
 *
 * @author caizhitao
 * @created 2020-11-26 22:35:25
 */
export interface EventManagerInterface {
    /**
     * 广播事件
     *
     * @param eventName 事件名
     * @param param 传递的剩余不定参数
     */
    emit(eventName: string, ...param: any[]): void;

    /**
     * 注册事件
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    on(eventName: string, callback: Function, target?: any): void;

    /**
     * 注册事件（接受函数执行一次后会自动销毁，不用主动off）
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    onOnce(eventName: string, callback: Function, target?: any): void;

    /**
     * 注销事件
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    off(eventName: string, callback?: Function, target?: any): void;

    /**
     * 注销某个已经注册的对象的所有事件
     *
     * @param target 事件函数处理的执行对象
     */
    offTarget(target: any): void;
}
