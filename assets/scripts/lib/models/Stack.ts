/**
 * 泛型栈
 *
 * @author caizhitao
 * @created 2020-11-28 09:49:52
 */
export default class Stack<T> {
    private _array: Array<T>;

    constructor() {
        this._array = new Array<T>();
    }
    /**
     * 往栈加入新的元素
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
     * 返回栈尾部元素，并从栈中移除
     *
     * @returns 取出的元素 或者 undefined(队列中没有元素时)
     */
    pop(): T {
        //  removes the last element from an array and returns that element. This method changes the length of the array.
        return this._array.pop();
    }

    /**
     * 返回栈头部元素，不会从栈中移除
     */
    first(): T {
        return this.isEmpty() ? null : this._array[0];
    }

    /**
     * 返回栈尾部元素，不会从栈中移除
     */
    last(): T {
        return this.isEmpty() ? null : this._array[this.size() - 1];
    }

    /**
     * 放回当前栈大小
     */
    size(): number {
        return this._array.length;
    }

    /**
     * 当前栈是否为空
     */
    isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * 清空栈，栈清空之后不能再继续使用
     */
    clear() {
        delete this._array;
    }
}
