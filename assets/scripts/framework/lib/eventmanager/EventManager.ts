import { EventManagerInterface } from "./EventManagerInterface";

/**
 * 默认事件管理器
 *
 * @author caizhitao
 * @created 2020-11-26 22:37:25
 */
export default class EventManager implements EventManagerInterface {
    /**
     * key: 事件名
     * value: 缓存事件
     */
    private _eventCacheMap: Map<string, EventCache[]> = new Map();

    /**
     * 广播事件
     *
     * @param eventName 事件名
     * @param param 传递的剩余不定参数
     */
    emit(eventName: string, ...param: any[]): void {
        let eventCacheArray = this._eventCacheMap.get(eventName);
        if (eventCacheArray) {
            let eventCache: EventCache = null;
            for (let i = eventCacheArray.length - 1; i >= 0; i--) {
                eventCache = eventCacheArray[i];
                // call 方法的语法和作用与 apply() 方法类似
                // 只有一个区别
                // 就是 call() 方法接受的是一个参数列表，而 apply() 方法接受的是一个包含多个参数的数组。
                eventCache.callback.apply(eventCache.target, param);

                // 只接受一次回调的事件，在触发之后就移除掉该缓存事件
                if (eventCache.once) {
                    eventCacheArray.splice(i, 1);
                }
            }
        }
    }

    /**
     * 注册事件
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    on(eventName: string, callback: Function, target?: any): void {
        this._on(eventName, callback, target, false);
    }

    /**
     * 注册事件（接受函数执行一次后会自动销毁，不用主动off）
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    onOnce(eventName: string, callback: Function, target?: any): void {
        this._on(eventName, callback, target, true);
    }

    /**
     * 注册事件
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     * @param once 是否只回调一次
     */
    private _on(eventName: string, callback: Function, target: any, once: boolean): void {
        let eventCacheArray = this._eventCacheMap.get(eventName);
        if (!eventCacheArray) {
            eventCacheArray = [];
        }
        let index = eventCacheArray.findIndex((eventCache) => {
            return eventCache.target === target && eventCache.callback === callback;
        });

        if (index === -1) {
            eventCacheArray.push({
                target: target,
                callback: callback,
                once: once,
            });
            this._eventCacheMap.set(eventName, eventCacheArray);
        }
    }

    /**
     * 注销事件
     *
     * @param eventName 事件名
     * @param callback 事件处理函数
     * @param target 事件处理函数的执行对象
     */
    off(eventName: string, callback?: Function, target?: any): void {
        let eventCacheArray = this._eventCacheMap.get(eventName);
        if (eventCacheArray) {
            if (callback && target) {
                let index = eventCacheArray.findIndex((eventCache) => {
                    return eventCache.target === target && eventCache.callback === callback;
                });
                if (index !== -1) {
                    eventCacheArray.splice(index, 1);
                    this._eventCacheMap.set(eventName, eventCacheArray);
                }
            } else {
                eventCacheArray = null;
                this._eventCacheMap.delete(eventName);
            }
        }
    }

    /**
     * 注销某个已经注册的对象的所有事件
     *
     * @param target 事件函数处理的执行对象
     */
    offTarget(target: any): void {
        this._eventCacheMap.forEach((eventCacheArray, eventName) => {
            if (eventCacheArray) {
                for (let i = eventCacheArray.length - 1; i >= 0; i--) {
                    if (eventCacheArray[i].target === target) {
                        eventCacheArray.splice(i, 1);
                    }
                }
            }
        });
    }
}

/**
 * 缓存事件
 */
interface EventCache {
    /**
     * 回调函数执行者
     */
    target: any;

    /**
     * 回调函数
     */
    callback: Function;

    /**
     * 是否只回调一次
     */
    once: boolean;
}
