/**
 * 本地存储管理接口
 *
 * @author caizhitao
 * @created 2020-11-26 23:40:30
 */
export interface LocalStorageInterface {
    /**
     * 读取指定key值的记录
     *
     * @param key 读取记录key
     */
    getItem(key: string): string;

    /**
     * 设置指定key值的记录
     *
     * @param key 待保存key（会覆盖现有的）
     * @param value 待保存value
     */
    setItem(key: string, value: string): void;

    /**
     * 移除指定key值
     *
     * @param key 待移除key
     */
    removeItem(key: string): void;
}
