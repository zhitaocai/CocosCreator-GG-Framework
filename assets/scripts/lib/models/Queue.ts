/**
 * @class 泛型队列
 *
 * @author caizhitao
 * @created 2020-11-28 09:49:52
 */
export default class Queue<T> {
    private _array: Array<T>;

    constructor() {
        this._array = new Array<T>();
    }

    /**
     * 往队尾加入新的元素
     *
     * @param element 待加入元素
     */
    push(element: T): boolean {
        if (element == null) {
            return false;
        }
        // adds one or more elements to the end of an array and returns the new length of the array.
        this._array.push(element);
        return true;
    }

    /**
     * 返回队列头部元素，并从队列中移除
     *
     * @returns 取出的元素 或者 undefined(队列中没有元素时)
     */
    pop(): T {
        // removes the first element from an array and returns that removed element. This method changes the length of the array.
        return this._array.shift();
    }

    /**
     * 返回队列头部元素，不会从队列中移除
     */
    first(): T {
        return this.isEmpty() ? null : this._array[0];
    }

    /**
     * 返回队列尾部元素，不会从队列中移除
     */
    last(): T {
        return this.isEmpty() ? null : this._array[this.size() - 1];
    }

    /**
     * 返回队列长度
     */
    size(): number {
        return this._array.length;
    }

    /**
     * 判断队列是否为空
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * 清空队列，队列清空之后不能再继续使用
     */
    clear() {
        delete this._array;
    }
}
