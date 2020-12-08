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
     * 展示面板
     */
    abstract show(option: PanelShowOption): void;

    /**
     * 隐藏面板
     */
    abstract hide(option: PanelHideOption): void;
}

export type PanelHideOption = {
    /**
     * 隐藏时传入的数据
     */
    data?: any;

    /**
     * 隐藏动画完毕后的回调函数（如果没有动画，则直接回调）
     */
    onHided: Function;
};

export type PanelShowOption = {
    /**
     * 展示时传入的数据
     */
    data?: any;

    /**
     * 展示动画完毕后回调的函数（如果没有动画，则直接回调）
     */
    onShowed: Function;
};
