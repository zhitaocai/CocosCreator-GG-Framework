import { gg } from "../../gg";
import { LocalStorageInterface } from "./LocalStorageInterface";

/**
 * 本地存储管理
 *
 * @author caizhitao
 * @created 2020-11-26 23:40:23
 */
export class LocalStorage implements LocalStorageInterface {
    /**
     * 读取指定key值的记录
     *
     * @param key 读取记录key
     */
    getItem(key: string): string {
        let value = cc.sys.localStorage.getItem(key);
        gg.logger.log("LocalStorage", "get", key, value);
        return value;
    }

    /**
     * 设置指定key值的记录
     *
     * @param key 待保存key（会覆盖现有的）
     * @param value 待保存value
     */
    setItem(key: string, value: string): void {
        gg.logger.log("LocalStorage", "set", key, value);
        cc.sys.localStorage.setItem(key, value);
    }

    /**
     * 移除指定key值
     *
     * @param key 待移除key
     */
    removeItem(key: string) {
        cc.sys.localStorage.removeItem(key);
    }
}
