import { EnhancedComponent } from "../components/EnhancedComponent";

const { ccclass, property } = cc._decorator;

/**
 * 面板组件
 *
 * @author caizhitao
 * @created 2020-11-28 09:51:33
 */
@ccclass
export abstract class PanelComponent extends EnhancedComponent {
    /**
     * 展示面板（此方法会被面板路由器所调用，请不要直接调用这个方法）
     */
    abstract show(option: PanelShowOption): void;

    /**
     * 隐藏面板（此方法会被面板路由器所调用，请不要直接调用这个方法）
     */
    abstract hide(option: PanelHideOption): void;
}

export interface PanelHideOption {
    /**
     * 隐藏时传入的数据
     */
    data?: any;

    /**
     * 隐藏动画完毕后的回调函数（如果没有动画，则直接回调）
     */
    onHided: Function;
}

export interface PanelShowOption {
    /**
     * 展示时传入的数据
     */
    data?: any;

    /**
     * 展示动画完毕后回调的函数（如果没有动画，则直接回调）
     */
    onShowed: Function;
}
